import { test, expect } from '@playwright/test';

test('test login', async ({ page }) => {
  // 1. Navegar a tu app (debe estar corriendo)
  await page.goto('http://localhost:4200');

  // 2. Interactuar (Localizar un botón por su texto y clicar)
  await page.getByRole('button', { name: 'Sign in' }).click();
  // 3. Verificar (Localizar un elemento por su texto y verificar que es visible)
  await page.getByLabel('User Name').fill('Admin');
  await page.getByLabel('Password').fill('Admin1234');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  
});