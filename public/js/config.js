/**
 * Configuração do Supabase (contas e sincronização do progresso).
 *
 * ATENÇÃO — isto NÃO é segredo, e está tudo bem ficar no repositório:
 * a chave "publishable" foi feita para ir ao navegador. Quem protege os dados
 * é a segurança por linha (RLS) no banco: cada pessoa só lê e escreve as
 * próprias linhas. (A chave secreta "service_role" NUNCA pode aparecer aqui.)
 */
export const SUPABASE_URL = 'https://wwkuzlwxmngvgyhjycyn.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_vYHS1r-URS2SOGBO8mDymA_T2vyKoIw';
