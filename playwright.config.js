/**
 * Testes de ponta a ponta (e2e): abrem o site num navegador de verdade e
 * clicam como um aluno. Rodam com `npm run test:e2e` e no GitHub Actions.
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.js',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'node scripts/serve.js',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
