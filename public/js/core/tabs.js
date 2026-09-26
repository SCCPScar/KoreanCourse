/**
 * Abas acessíveis (padrão WAI-ARIA "Tabs").
 *
 * HTML esperado:
 *   <div role="tablist">
 *     <button role="tab" id="tab-a" aria-controls="panel-a">A</button> …
 *   </div>
 *   <section role="tabpanel" id="panel-a" aria-labelledby="tab-a"> … </section>
 *
 * Teclado: ← e → mudam de aba; Home e End vão para a primeira e a última.
 * Só a aba ativa está na ordem do Tab, para não obrigar a passar por todas.
 */
const KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 };

/** Índice da próxima aba ao apertar uma tecla (ou null se a tecla não importa). */
export function nextTabIndex(key, current, count) {
  if (key in KEY_STEPS) return (current + KEY_STEPS[key] + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

export function initTabs(tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

  function select(index, moveFocus) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (moveFocus) tabs[index].focus();
  }

  tablist.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab), false);
  });

  tablist.addEventListener('keydown', (event) => {
    const index = nextTabIndex(event.key, tabs.indexOf(document.activeElement), tabs.length);
    if (index === null) return;
    event.preventDefault();
    select(index, true);
  });

  select(0, false);
}
