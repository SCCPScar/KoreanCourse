import { expect, test } from '@playwright/test';
import { goTo, playStation, startAsStudent } from './helpers.js';

test('concluir a primeira estação dá o selo, conta o dia e cria flashcards', async ({ page }) => {
  const errors = await startAsStudent(page);
  await page.goto('/');

  await page.locator('#home-next-link').click();
  await expect(page.locator('#lesson-dialog')).toBeVisible();
  await playStation(page, 'l1-vogais');

  await expect(page.getByRole('heading', { name: 'Estação concluída!' })).toBeVisible();
  await expect(page.locator('.lesson__score')).toContainText('de primeira');
  await page.locator('[data-action=lesson-close]').click();

  // Início: dia de estudo contado e cartões à espera.
  await expect(page.locator('#home-streak-count')).toHaveText('1 dia');
  await expect(page.locator('#home-stamps')).toContainText('1 de');
  await expect(page.locator('#home-review-count')).not.toHaveText('0 cartões');

  // Revisão: virar o cartão e responder com o teclado.
  await page.locator('#view-inicio').getByRole('button', { name: 'Revisar agora' }).click();
  await page.getByRole('button', { name: 'Mostrar resposta' }).click();
  await expect(page.locator('.flashcard')).toHaveAttribute('data-flipped', 'true');
  await page.keyboard.press('3');
  await expect(page.locator('#review-stage .lesson__eyebrow')).toContainText('Cartão 2');
  await page.keyboard.press('Escape');

  // Passaporte com o selo.
  await goTo(page, 'Percurso');
  await page.getByRole('tab', { name: 'Passaporte' }).click();
  await expect(page.locator('#passport-summary')).toContainText('1');
  expect(errors).toEqual([]);
});

test('o quiz relâmpago vai até o resultado', async ({ page }) => {
  const errors = await startAsStudent(page, 'basico');
  await page.goto('/#praticar');
  await page.locator('[data-action=open-quiz]').click();
  for (let question = 0; question < 10; question += 1) {
    await page.locator('#practice-stage .opt').first().click();
    await page.locator('#practice-footer .lesson__primary').click();
  }
  await expect(page.getByRole('heading', { name: 'Quiz concluído!' })).toBeVisible();
  await expect(page.locator('#practice-stage')).toContainText('Maior combo');
  expect(errors).toEqual([]);
});

test('a pronúncia pede consentimento antes de usar o microfone', async ({ page }) => {
  await startAsStudent(page);
  await page.goto('/#praticar');
  await page.locator('[data-action=open-pronunciation]').click();
  await expect(page.getByRole('heading', { name: 'Antes de usar o microfone' })).toBeVisible();
  await page.getByRole('button', { name: 'Agora não' }).click();
  await expect(page.locator('#practice-dialog')).toBeHidden();
  const consent = await page.evaluate(() => localStorage.getItem('haru:mic-consent'));
  expect(consent).toBeNull();
});
