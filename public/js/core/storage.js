/**
 * Wrapper seguro do localStorage.
 *
 * O localStorage pode falhar (modo privado, armazenamento cheio ou bloqueado),
 * por isso todas as operações estão dentro de try/catch e a app continua
 * funcionando — só não salva o progresso.
 *
 * Todas as chaves têm o prefixo da app, para que "Apagar os meus dados"
 * remova só o que é nosso.
 */
export const STORAGE_PREFIX = 'haru:';

/** Lê um valor JSON. Retorna `fallback` se não existir ou se der erro. */
export function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Salva um valor como JSON. Retorna true se deu certo. */
export function writeJSON(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Remove uma chave. */
export function removeKey(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // Sem acesso ao armazenamento: não há nada para remover.
  }
}

/** Remove TODAS as chaves da app (usado em "Apagar os meus dados"). */
export function clearAppData() {
  try {
    const ownKeys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) ownKeys.push(key);
    }
    ownKeys.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}
