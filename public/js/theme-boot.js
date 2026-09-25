/*
 * Aplica o tema escolhido ANTES de a página ser desenhada, para evitar o "piscar"
 * de tema (a página aparecer clara por um instante e só depois ficar escura).
 *
 * Exceção justificada à regra "scripts no fim do <body> ou type=module":
 * os módulos só correm depois de a página ser desenhada, por isso este script
 * pequeno e síncrono tem de estar no <head>. Não usa import nem mexe no DOM além
 * do atributo data-theme. A chave tem de ser igual à de core/storage.js + core/theme.js.
 */
(function applyStoredTheme() {
  try {
    const mode = JSON.parse(localStorage.getItem('haru:theme'));
    if (mode === 'light' || mode === 'dark') document.documentElement.dataset.theme = mode;
  } catch {
    // Sem acesso ao armazenamento: fica o tema do sistema.
  }
})();
