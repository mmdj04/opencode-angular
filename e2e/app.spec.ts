import { expect, test } from '@playwright/test';

test.describe('Agentwork Search Homepage', () => {
  test('should display the Agentwork logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agentwork');
  });

  test('should display search input with placeholder', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Pesquisar no Agentwork ou digitar uma URL');

    await expect(searchInput).toBeVisible();
  });

  test('should display action buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Agentwork Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Estou com sorte' })).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sobre')).toBeVisible();
  });

  test('should navigate to results on Enter', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Pesquisar no Agentwork ou digitar uma URL');

    await searchInput.fill('angular');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/search\/results\?q=angular/);
  });

  test('should navigate to results on button click', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Pesquisar no Agentwork ou digitar uma URL');

    await searchInput.fill('spartan');
    await page.getByRole('button', { name: 'Agentwork Search' }).click();
    await expect(page).toHaveURL(/\/search\/results\?q=spartan/);
  });
});

test.describe('Agentwork Search Results', () => {
  test('should display search header with query', async ({ page }) => {
    await page.goto('/search/results?q=angular');

    const searchInput = page.locator('input[type="search"]');

    await expect(searchInput).toHaveValue('angular');
  });

  test('should display tabs', async ({ page }) => {
    await page.goto('/search/results?q=angular');
    await expect(page.getByRole('tab', { name: 'Todos' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Imagens' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Vídeos' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Notícias' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Maps' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Mais' })).toBeVisible();
  });

  test('should display results count', async ({ page }) => {
    await page.goto('/search/results?q=angular');
    await expect(page.getByText(/Cerca de \d+ resultados/)).toBeVisible();
  });

  test('should display search results', async ({ page }) => {
    await page.goto('/search/results?q=angular');
    await expect(page.getByText('Angular — Plataforma de desenvolvimento web')).toBeVisible();
  });

  test('should navigate back to homepage via logo', async ({ page }) => {
    await page.goto('/search/results?q=angular');
    await page.getByRole('link', { name: 'Agentwork' }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('404 Page', () => {
  test('should display not found page for unknown routes', async ({ page }) => {
    const response = await page.goto('/nonexistent-route');

    expect(response?.status()).toBe(200);
    await expect(page.getByText(/não encontrada|not found/i)).toBeVisible();
  });
});
