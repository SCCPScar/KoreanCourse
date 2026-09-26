/**
 * Janela "Conta e configurações".
 *
 * Telas (só uma aparece de cada vez):
 *  - guest:    entrar ou criar conta (e as configurações);
 *  - forgot:   pedir o link para trocar a senha;
 *  - recovery: escolher a nova senha (depois de abrir o link do email);
 *  - user:     sessão iniciada — sair, baixar meus dados, apagar conta.
 *
 * Sem conta, o site funciona do mesmo jeito: o progresso fica neste navegador.
 */
import { registerAction } from '../core/actions.js';
import {
  authErrorFromUrl,
  cleanAuthParamsFromUrl,
  deleteAccount,
  getSupabase,
  onAuthChange,
  sendPasswordReset,
  signIn,
  signOut,
  signUp,
  updatePassword,
} from '../core/auth.js';
import { getCourseProgress } from '../core/course-progress.js';
import { byId } from '../core/dom.js';
import { getLearnedIds } from '../core/learned-words.js';
import { getLevel } from '../core/level.js';
import {
  clearLocalUserData,
  initSyncListeners,
  onSyncStatus,
  stopSync,
  syncAll,
} from '../core/sync.js';
import { authErrorMessage, passwordProblem } from '../lib/auth-errors.js';

const VIEWS = ['guest', 'forgot', 'recovery', 'user', 'delete'];
const SYNC_TEXT = {
  idle: '',
  syncing: 'Sincronizando…',
  synced: '✓ Progresso salvo na sua conta.',
  offline: 'Sem conexão: o progresso fica salvo aqui e sobe para a conta depois.',
};

let ui;
let session = null;
let displayName = null;

function showView(name) {
  VIEWS.forEach((view) => {
    ui.views[view].hidden = view !== name;
  });
}

/** Mensagem no topo da janela (role="status": o leitor de tela anuncia). */
function say(text, tone = 'info') {
  ui.message.textContent = text;
  ui.message.dataset.tone = tone;
  ui.message.hidden = !text;
}

/** Enquanto espera o servidor, desliga o botão para evitar cliques duplos. */
async function withBusy(form, task) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await task();
  } finally {
    button.disabled = false;
  }
}

function updateNavButton() {
  const initial = displayName?.trim()?.[0] ?? session?.user?.email?.[0];
  ui.navInitial.textContent = initial ? initial.toUpperCase() : '';
  ui.navInitial.hidden = !session;
  // O ícone é um <svg>: a propriedade .hidden só existe em elementos HTML,
  // por isso mudamos o ATRIBUTO diretamente.
  ui.navIcon.toggleAttribute('hidden', Boolean(session));
  ui.navButton.setAttribute(
    'aria-label',
    session
      ? `Conta de ${displayName ?? session.user.email} e configurações`
      : 'Entrar e configurações',
  );
}

function renderUser() {
  ui.userName.textContent = displayName ?? 'estudante';
  ui.userEmail.textContent = session.user.email;
  showView('user');
  updateNavButton();
}

/* ───────── Formulários ───────── */

async function onSignIn(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  await withBusy(form, async () => {
    const { error } = await signIn({
      email: data.get('email').trim(),
      password: data.get('password'),
    });
    if (error) say(authErrorMessage(error), 'error');
    else form.reset();
  });
}

async function onSignUp(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const problem = passwordProblem(data.get('password'));
  if (problem) {
    say(problem, 'error');
    form.elements.password.focus();
    return;
  }
  await withBusy(form, async () => {
    const email = data.get('email').trim();
    const { data: result, error } = await signUp({
      name: data.get('name').trim(),
      email,
      password: data.get('password'),
    });
    if (error) {
      say(authErrorMessage(error), 'error');
      return;
    }
    form.reset();
    // Com confirmação por email ligada, ainda não há sessão: o aluno precisa abrir o link.
    if (!result.session) {
      say(
        `Quase lá! Enviamos um link de confirmação para ${email}. Abra-o para ativar a conta.`,
        'success',
      );
    }
  });
}

async function onForgot(event) {
  event.preventDefault();
  const form = event.currentTarget;
  await withBusy(form, async () => {
    const email = new FormData(form).get('email').trim();
    const { error } = await sendPasswordReset(email);
    if (error) {
      say(authErrorMessage(error), 'error');
      return;
    }
    // A mesma resposta exista ou não a conta: assim ninguém descobre quais emails têm conta.
    say(
      `Se existir uma conta com ${email}, você vai receber um link para criar uma nova senha.`,
      'success',
    );
    showView('guest');
  });
}

async function onRecovery(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const password = new FormData(form).get('password');
  const problem = passwordProblem(password);
  if (problem) {
    say(problem, 'error');
    return;
  }
  await withBusy(form, async () => {
    const { error } = await updatePassword(password);
    if (error) {
      say(authErrorMessage(error), 'error');
      return;
    }
    form.reset();
    say('Senha atualizada! Você já está com a sessão iniciada.', 'success');
    renderUser();
  });
}

/* ───────── Ações da conta ───────── */

async function onSignOut() {
  await signOut();
  // Num computador partilhado, o próximo aluno não deve ver o progresso deste.
  clearLocalUserData();
  say('Você saiu. Seu progresso continua guardado na sua conta.', 'success');
}

async function onDeleteConfirmed() {
  const { error } = await deleteAccount();
  if (error) {
    say(authErrorMessage(error), 'error');
    showView('user');
    return;
  }
  await signOut();
  clearLocalUserData();
  say('Sua conta e todos os seus dados foram apagados.', 'success');
}

/** RGPD/LGPD: direito de portabilidade — baixar os próprios dados num arquivo. */
function onExport() {
  const data = {
    exportadoEm: new Date().toISOString(),
    conta: session ? { email: session.user.email, nome: displayName } : null,
    nivel: getLevel(),
    estacoesConcluidas: getCourseProgress().stations,
    palavrasAprendidas: [...getLearnedIds()],
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'haru-meus-dados.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

/* ───────── Sessão ───────── */

async function handleAuth(event, newSession) {
  if (event === 'UNAVAILABLE') {
    ui.accountSection.hidden = true;
    ui.unavailable.hidden = false;
    return;
  }
  cleanAuthParamsFromUrl();

  if (event === 'PASSWORD_RECOVERY') {
    session = newSession;
    showView('recovery');
    if (!ui.dialog.open) ui.dialog.showModal();
    return;
  }

  const userChanged = newSession?.user?.id !== session?.user?.id;
  session = newSession;
  if (!session) {
    displayName = null;
    stopSync();
    showView('guest');
    updateNavButton();
    return;
  }
  if (userChanged) {
    renderUser();
    const result = await syncAll(session.user.id);
    displayName = result.displayName;
    renderUser();
    if (event === 'SIGNED_IN' && ui.dialog.open)
      say(`Bem-vindo(a), ${displayName ?? 'estudante'}!`, 'success');
  }
}

export function initAccount() {
  ui = {
    dialog: byId('account-dialog'),
    message: byId('account-message'),
    accountSection: byId('account-section'),
    unavailable: byId('account-unavailable'),
    views: Object.fromEntries(VIEWS.map((view) => [view, byId(`account-view-${view}`)])),
    userName: byId('account-user-name'),
    userEmail: byId('account-user-email'),
    sync: byId('account-sync'),
    navButton: byId('account-button'),
    navIcon: byId('account-button-icon'),
    navInitial: byId('account-button-initial'),
  };

  byId('signin-form').addEventListener('submit', onSignIn);
  byId('signup-form').addEventListener('submit', onSignUp);
  byId('forgot-form').addEventListener('submit', onForgot);
  byId('recovery-form').addEventListener('submit', onRecovery);

  registerAction('open-account', () => {
    say('');
    ui.dialog.showModal();
  });
  registerAction('close-account', () => ui.dialog.close());
  registerAction('account-forgot', () => {
    say('');
    showView('forgot');
  });
  registerAction('account-back', () => {
    say('');
    showView(session ? 'user' : 'guest');
  });
  registerAction('account-sign-out', onSignOut);
  registerAction('account-export', onExport);
  registerAction('account-delete', () => showView('delete'));
  registerAction('account-delete-confirm', onDeleteConfirmed);

  onSyncStatus(({ status }) => {
    ui.sync.textContent = SYNC_TEXT[status];
    ui.sync.dataset.status = status;
  });

  const linkError = authErrorFromUrl();
  if (linkError) {
    say(authErrorMessage({ code: linkError }), 'error');
    ui.dialog.showModal();
  }

  showView('guest');
  updateNavButton();
  if (getSupabase()) initSyncListeners();
  onAuthChange(handleAuth);
}
