/**
 * Traduz os erros do Supabase Auth para mensagens claras em português.
 * Cada mensagem diz o que aconteceu e o que fazer.
 */

const MESSAGES = {
  invalid_credentials: 'Email ou senha incorretos.',
  email_not_confirmed:
    'Seu email ainda não foi confirmado. Abra o link que enviamos para sua caixa de entrada.',
  user_already_exists: 'Já existe uma conta com este email. Tente entrar.',
  email_exists: 'Já existe uma conta com este email. Tente entrar.',
  weak_password: 'Senha fraca: use pelo menos 8 caracteres, com letras e números.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitos emails enviados. Espere alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  email_address_invalid: 'Este endereço de email não é válido.',
  email_address_not_authorized:
    'O envio de emails ainda não está liberado para este endereço. Fale com quem administra o site.',
  signup_disabled: 'A criação de contas está desativada no momento.',
  session_not_found: 'Sua sessão expirou. Entre de novo.',
  otp_expired: 'O link expirou. Peça um novo.',
  flow_state_expired: 'O link expirou. Peça um novo.',
};

const FALLBACK = 'Não foi possível concluir agora. Tente de novo em instantes.';
const OFFLINE = 'Sem conexão com o servidor. Verifique sua internet e tente de novo.';

/** Recebe um erro (do Supabase ou da rede) e devolve a mensagem para o aluno. */
export function authErrorMessage(error) {
  if (!error) return FALLBACK;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.name === 'AuthRetryableFetchError' || error.status === 0) return OFFLINE;
  if (error instanceof TypeError) return OFFLINE; // fetch falhou (sem internet)
  return FALLBACK;
}

/** Regras mínimas de senha, verificadas antes de enviar ao servidor. */
export function passwordProblem(password) {
  if (password.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return 'Use letras e números na senha.';
  }
  return null;
}
