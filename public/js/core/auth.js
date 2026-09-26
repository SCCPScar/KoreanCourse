/**
 * Contas de aluno com o Supabase Auth (email + senha).
 *
 * A biblioteca supabase-js é carregada em index.html (public/vendor/supabase.js)
 * e cria a variável global `supabase`. Se ela não carregar (sem internet na
 * primeira visita, bloqueador…), o site continua funcionando sem contas.
 *
 * flowType 'pkce': os links de email voltam com ?code=… na URL (e não com
 * #access_token=…), o que não atrapalha o nosso roteador, que usa o #.
 */
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config.js';

let client = null;

/** Cliente do Supabase, ou null se a biblioteca não estiver disponível. */
export function getSupabase() {
  if (client) return client;
  if (!window.supabase?.createClient) return null;
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'haru:auth',
    },
  });
  return client;
}

/** Endereço para onde os links de email devem voltar (esta mesma página). */
export const redirectUrl = () => `${window.location.origin}${window.location.pathname}`;

/** Remove ?code=… (e erros do link) da URL depois de usados, sem recarregar a página. */
export function cleanAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  const had = ['code', 'error', 'error_code', 'error_description'].some((key) =>
    url.searchParams.has(key),
  );
  if (!had) return;
  ['code', 'error', 'error_code', 'error_description'].forEach((key) =>
    url.searchParams.delete(key),
  );
  history.replaceState(null, '', url.pathname + url.search + url.hash);
}

/** Erro que veio no link de email (ex.: link expirado), ou null. */
export function authErrorFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('error_code') ?? params.get('error');
}

export async function signUp({ name, email, password }) {
  return getSupabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl(),
      // Vão para o perfil pelo gatilho handle_new_user() no banco.
      data: { display_name: name, age_confirmed: 'true', privacy_accepted: 'true' },
    },
  });
}

export const signIn = ({ email, password }) =>
  getSupabase().auth.signInWithPassword({ email, password });

export const signOut = (scope = 'local') => getSupabase().auth.signOut({ scope });

export const sendPasswordReset = (email) =>
  getSupabase().auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });

export const updatePassword = (password) => getSupabase().auth.updateUser({ password });

/** Apaga a conta de quem está com sessão (função delete_my_account no banco). */
export const deleteAccount = () => getSupabase().rpc('delete_my_account');

/**
 * Avisa sempre que a sessão muda (entrar, sair, link de nova senha…).
 * O callback roda depois (setTimeout) porque chamar o Supabase DENTRO do
 * onAuthStateChange pode travar a biblioteca — recomendação da documentação.
 */
export function onAuthChange(callback) {
  const supabase = getSupabase();
  if (!supabase) {
    callback('UNAVAILABLE', null);
    return;
  }
  supabase.auth.onAuthStateChange((event, session) => {
    setTimeout(() => callback(event, session), 0);
  });
}
