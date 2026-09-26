import { expect, test } from '@playwright/test';
import { goTo, startAsStudent } from './helpers.js';

const SECTIONS = ['Percurso', 'Praticar', 'Hangul', 'Vocabulário', 'Gramática', 'Início'];

test('todas as seções abrem sem erros e o título da aba acompanha', async ({ page }) => {
  const errors = await startAsStudent(page);
  await page.goto('/');
  await expect(page.locator('#view-inicio')).toBeVisible();

  for (const name of SECTIONS) {
    const link = await goTo(page, name);
    await expect(page).toHaveTitle(new RegExp(name));
    await expect(link).toHaveAttribute('aria-current', 'page');
  }
  // Nada de rolagem horizontal em nenhuma largura.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('a política de privacidade abre e tem o contato', async ({ page }) => {
  await page.goto('/privacidade.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de privacidade');
  await expect(page.getByRole('link', { name: /@gmail\.com/ })).toBeVisible();
});

test('o tema escuro pode ser escolhido nas configurações', async ({ page }) => {
  await startAsStudent(page);
  await page.goto('/');
  await page.locator('#account-button').click();
  await page.getByLabel('Escuro').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
