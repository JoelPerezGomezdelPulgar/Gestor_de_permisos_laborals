import { test, expect } from "@playwright/test";

test("test login", async ({ page }) => {
    // 1. Navegar a tu app (debe estar corriendo)
    await page.goto("http://localhost:4200");

    // 2. Interactuar (Localizar un botón por su texto y clicar)
    await page.getByRole("button", { name: "Sign in" }).click();
    // 3. Verificar (Localizar un elemento por su texto y verificar que es visible)
    await page.getByLabel("Nom d'usuari").fill("Admin");
    await page.getByLabel("Contrasenya").fill("Admin1234");
    await page.getByRole("button", { name: "Inicia sessió" }).click();
    await expect(page).toHaveURL(/admin/);
});
test("Wrong Password", async ({ page }) => {
    // 1. Navegar a tu app (debe estar corriendo)
    await page.goto("http://localhost:4200");

    // 2. Interactuar (Localizar un botón por su texto y clicar)
    await page.getByRole("button", { name: "Sign in" }).click();
    // 3. Verificar (Localizar un elemento por su texto y verificar que es visible)
    await page.getByLabel("Nom d'usuari").fill("Admin");
    await page.getByLabel("Contrasenya").fill("Error");
    // Esperar al diálogo de alerta que se dispara al hacer click
    const [dialog] = await Promise.all([
        page.waitForEvent("dialog"),
        page.getByRole("button", { name: "Inicia sessió" }).click(),
    ]);
    expect(dialog.message()).toBe("undefined");
    await dialog.accept();
});