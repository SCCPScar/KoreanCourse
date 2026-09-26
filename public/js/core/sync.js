/**
 * Sincronização do progresso com a conta (Supabase).
 *
 * Como funciona:
 *  1. Ao entrar (ou ao abrir o site já com sessão), baixa o que está na nuvem,
 *     junta com o que está neste aparelho (lib/sync-merge.js) e envia de volta
 *     o que a nuvem ainda não tinha. Assim nada se perde.
 *  2. Depois disso, cada mudança local (estação concluída, palavra marcada,
 *     nível, cartão revisto, dia de estudo, meta) é enviada na hora, ouvindo os eventos que os módulos já disparam.
 *  3. Se a internet cair, a mudança fica salva localmente e sobe na próxima
 *     sincronização completa (passo 1).
 */
import { getSupabase } from './auth.js';
import { getCardStates, onCardsChange, replaceCardStates } from './cards.js';
import {
  getCourseProgress,
  onCourseProgressChange,
  replaceCourseProgress,
} from './course-progress.js';
import { clearDailyGoal, getSavedGoal, onDailyGoalChange, setDailyGoal } from './daily-goal.js';
import { clearRecords } from './game-records.js';
import { getLearnedIds, onLearnedWordsChange, replaceLearnedIds } from './learned-words.js';
import { clearLevel, getLevel, onLevelChange, setLevel } from './level.js';
import { getStudyDays, onStudyChange, replaceStudyDays } from './study-log.js';
import {
  cardToRow,
  cardsToUpload,
  daysToUpload,
  mergeCardStates,
  mergeGoal,
  mergeLevel,
  mergeStations,
  mergeStudyDays,
  mergeWords,
  rowsToCards,
  rowsToStations,
  rowsToStudyDays,
  stationToRow,
  stationsToUpload,
  studyDayToRow,
  wordsToUpload,
} from '../lib/sync-merge.js';

const STATUS_EVENT = 'haru:syncstatus';

let userId = null;
let applyingRemote = false; // true enquanto gravamos dados vindos da nuvem

function setStatus(status, detail = '') {
  document.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { status, detail } }));
}

/** status: 'idle' | 'syncing' | 'synced' | 'offline' */
export function onSyncStatus(callback) {
  document.addEventListener(STATUS_EVENT, (event) => callback(event.detail));
}

async function throwOnError(promise) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}

/** Baixa tudo da nuvem, junta com o local e envia o que faltar. */
export async function syncAll(uid) {
  const db = getSupabase();
  userId = uid;
  setStatus('syncing');
  try {
    const [profile, stationRows, wordRows, cardRows, dayRows] = await Promise.all([
      throwOnError(
        db.from('profiles').select('display_name, level, daily_goal').eq('id', uid).maybeSingle(),
      ),
      throwOnError(db.from('station_progress').select('*').eq('user_id', uid)),
      throwOnError(db.from('learned_words').select('word_id').eq('user_id', uid)),
      throwOnError(db.from('card_states').select('*').eq('user_id', uid)),
      throwOnError(db.from('study_days').select('*').eq('user_id', uid)),
    ]);

    const remoteStations = rowsToStations(stationRows);
    const remoteWords = wordRows.map((row) => row.word_id);
    const remoteCards = rowsToCards(cardRows);
    const remoteDays = rowsToStudyDays(dayRows);
    const stations = mergeStations(getCourseProgress().stations, remoteStations);
    const words = mergeWords([...getLearnedIds()], remoteWords);
    const cards = mergeCardStates(getCardStates(), remoteCards);
    const days = mergeStudyDays(getStudyDays(), remoteDays);
    const level = mergeLevel(getLevel(), profile?.level);
    const goal = mergeGoal(getSavedGoal(), profile?.daily_goal);

    // Grava localmente sem reenviar cada item (os eventos são ignorados enquanto isso).
    applyingRemote = true;
    replaceCourseProgress(stations);
    replaceLearnedIds(words);
    replaceCardStates(cards);
    replaceStudyDays(days);
    if (level) setLevel(level);
    if (goal) setDailyGoal(goal);
    applyingRemote = false;

    const uploads = [];
    const newStations = stationsToUpload(stations, remoteStations);
    if (newStations.length > 0) {
      uploads.push(
        db
          .from('station_progress')
          .upsert(newStations.map((id) => stationToRow(uid, id, stations[id]))),
      );
    }
    const newWords = wordsToUpload(words, remoteWords);
    if (newWords.length > 0) {
      uploads.push(
        db.from('learned_words').upsert(newWords.map((id) => ({ user_id: uid, word_id: id }))),
      );
    }
    const newCards = cardsToUpload(cards, remoteCards);
    if (newCards.length > 0) {
      uploads.push(
        db.from('card_states').upsert(newCards.map((id) => cardToRow(uid, id, cards[id]))),
      );
    }
    const newDays = daysToUpload(days, remoteDays);
    if (newDays.length > 0) {
      uploads.push(
        db.from('study_days').upsert(newDays.map((day) => studyDayToRow(uid, day, days[day]))),
      );
    }
    const profileChanges = {};
    if (level && level !== profile?.level) profileChanges.level = level;
    if (goal && goal !== profile?.daily_goal) profileChanges.daily_goal = goal;
    if (Object.keys(profileChanges).length > 0) {
      uploads.push(db.from('profiles').update(profileChanges).eq('id', uid));
    }
    await Promise.all(uploads.map(throwOnError));
    setStatus('synced');
    return { displayName: profile?.display_name ?? null };
  } catch (error) {
    applyingRemote = false;
    setStatus('offline', error?.message ?? '');
    return { displayName: null };
  }
}

/** Envia UMA mudança para a nuvem. Se falhar, a próxima sincronização completa resolve. */
async function push(request) {
  if (!userId || applyingRemote) return;
  setStatus('syncing');
  try {
    await throwOnError(request());
    setStatus('synced');
  } catch {
    setStatus('offline');
  }
}

export function stopSync() {
  userId = null;
  setStatus('idle');
}

/** Apaga deste aparelho os dados pessoais (ao sair da conta, num computador partilhado). */
export function clearLocalUserData() {
  applyingRemote = true;
  replaceCourseProgress({});
  replaceLearnedIds([]);
  replaceCardStates({});
  replaceStudyDays({});
  clearLevel();
  clearDailyGoal();
  clearRecords();
  applyingRemote = false;
}

/** Liga os "ouvintes" que enviam cada mudança local para a nuvem. */
export function initSyncListeners() {
  onCourseProgressChange((event) => {
    const stationId = event.detail;
    if (!stationId) return;
    const record = getCourseProgress().stations[stationId];
    push(() =>
      getSupabase()
        .from('station_progress')
        .upsert(stationToRow(userId, stationId, record)),
    );
  });

  onLearnedWordsChange((event) => {
    if (!event.detail) return;
    const { id, learned } = event.detail;
    push(() =>
      learned
        ? getSupabase().from('learned_words').upsert({ user_id: userId, word_id: id })
        : getSupabase().from('learned_words').delete().eq('user_id', userId).eq('word_id', id),
    );
  });

  onLevelChange((event) => {
    if (!event.detail) return;
    push(() => getSupabase().from('profiles').update({ level: event.detail }).eq('id', userId));
  });

  onCardsChange((event) => {
    const cardId = event.detail;
    if (!cardId) return;
    const state = getCardStates()[cardId];
    push(() =>
      getSupabase()
        .from('card_states')
        .upsert(cardToRow(userId, cardId, state)),
    );
  });

  onStudyChange((event) => {
    const day = event.detail;
    if (!day) return;
    const record = getStudyDays()[day];
    push(() =>
      getSupabase()
        .from('study_days')
        .upsert(studyDayToRow(userId, day, record)),
    );
  });

  onDailyGoalChange((event) => {
    if (!event.detail) return;
    push(() =>
      getSupabase().from('profiles').update({ daily_goal: event.detail }).eq('id', userId),
    );
  });
}
