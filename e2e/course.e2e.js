/**
 * Joga TODAS as estações do curso respondendo certo. Se alguma lição tiver
 * uma resposta impossível (peça faltando, opção sem a resposta…), este teste falha.
 */
import { expect, test } from '@playwright/test';
import { LINES, STATIONS, stationsOfLine } from '../public/js/data/course.js';
import { playStation, startAsStudent } from './helpers.js';

for (const line of LINES) {
  test(`todas as estações da Linha ${line.number} têm solução`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Basta rodar numa tela.');
    test.setTimeout(180_000);
    const errors = await startAsStudent(page, 'avancado');
    // As estações das linhas anteriores já concluídas (senão a primeira desta fica trancada).
    const before = STATIONS.slice(0, STATIONS.indexOf(stationsOfLine(line.id)[0]));
    const done = { completedAt: '2026-01-01T00:00:00.000Z', correct: 1, total: 1, attempts: 1 };
    await page.addInitScript(
      (ids) => {
        if (localStorage.getItem('haru:course-progress')) return;
        const stations = Object.fromEntries(ids.map(([id, record]) => [id, record]));
        localStorage.setItem('haru:course-progress', JSON.stringify({ stations }));
      },
      before.map((station) => [station.id, done]),
    );
    await page.goto('/#percurso');

    for (const station of stationsOfLine(line.id)) {
      await page.locator(`[data-station="${station.id}"]`).click();
      await playStation(page, station.id);
      await page.locator('[data-action=lesson-close]').click();
      await expect(page.locator('#lesson-dialog')).toBeHidden();
    }
    expect(errors).toEqual([]);
  });
}
