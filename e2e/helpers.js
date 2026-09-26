/**
 * Ajudas comuns dos testes e2e.
 */
import { expect } from '@playwright/test';
import { findStation } from '../public/js/data/course.js';

/** Começa com um aluno de nível zero, sem avisos, e guarda os erros do console. */
export async function startAsStudent(page, level = 'zero') {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.addInitScript((chosen) => {
    if (sessionStorage.getItem('e2e-seeded')) return;
    sessionStorage.setItem('e2e-seeded', '1');
    localStorage.setItem('haru:level', JSON.stringify(chosen));
    localStorage.setItem('haru:voice-warning-dismissed', 'true');
  }, level);
  return errors;
}

/** Vai para uma seção pelo menu (abre o menu de celular se for preciso). Retorna o link. */
export async function goTo(page, name) {
  const toggle = page.locator('#nav-toggle');
  if (await toggle.isVisible()) await toggle.click();
  const link = page.locator('#nav-menu .site-nav__link', { hasText: name });
  const route = (await link.getAttribute('href')).slice(1);
  await link.click();
  await expect(page.locator(`#view-${route}`)).toBeVisible();
  return link;
}

/** Joga a estação aberta na janela da lição, respondendo certo a cada passo (dados do curso). */
export async function playStation(page, stationId) {
  const station = findStation(stationId);
  const stage = page.locator('#lesson-stage');
  const primary = page.locator('#lesson-primary');
  await primary.click(); // "Começar"

  for (const step of station.steps) {
    if (step.type === 'learn') {
      await primary.click(); // "Continuar"
      continue;
    }
    if (step.type === 'choice') {
      await stage.getByRole('button', { name: step.answer, exact: true }).click();
    } else if (step.type === 'build') {
      for (const tile of step.tiles) {
        await stage
          .locator('.build__pool')
          .getByRole('button', { name: tile, exact: true })
          .first()
          .click();
      }
    } else if (step.type === 'read') {
      await page.locator('#lesson-input').fill(step.answers[0]);
    }
    await primary.click(); // "Verificar"
    await expect(
      page.locator('#lesson-feedback'),
      `${stationId}: ${JSON.stringify(step)}`,
    ).toHaveClass(/is-right/);
    await primary.click(); // "Continuar"
  }
  await expect(page.getByRole('heading', { name: 'Estação concluída!' })).toBeVisible();
}
