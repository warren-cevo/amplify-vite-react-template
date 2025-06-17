import { test, expect } from '@playwright/test';

test.describe('Native Playwright', () => {
    test(`Should verify that user is authenticated`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        const pageContent = await page.textContent('body');
        expect(pageContent).toContain('Add your todos');
        await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
    });

    test(`Should add three todos`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000);
        const items = page.locator('ul[data-testid="todos-count"] > li');
        for (let i = 0; i < await items.count(); i++) {
            await items.nth(i).click();
        }
        await page.getByPlaceholder('What are you going to do').click();
        await page.getByPlaceholder('What are you going to do').fill('eat');
        await page.getByPlaceholder('What are you going to do').press('Enter');

        await page.getByPlaceholder('What are you going to do').click();
        await page.getByPlaceholder('What are you going to do').fill('drink');
        await page.getByPlaceholder('What are you going to do').press('Enter');

        await page.getByPlaceholder('What are you going to do').click();
        await page.getByPlaceholder('What are you going to do').fill('sleep');
        await page.getByPlaceholder('What are you going to do').press('Enter');

        const items2 = page.locator('ul[data-testid="todos-count"] > li');
        expect(await items2.nth(0).textContent()).toContain("eat");
        expect(await items2.nth(1).textContent()).toContain("drink");
        expect(await items2.nth(2).textContent()).toContain("sleep");
    });

    test(`Should clear the input textbox after adding a todo`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000);
        await page.getByPlaceholder('What are you going to do').click();
        await page.getByPlaceholder('What are you going to do').fill('eat');
        await page.getByPlaceholder('What are you going to do').press('Enter');

        const items = page.locator('input[data-testid="todo-input"]');
        expect(await items.inputValue()).toEqual('');
    });

    test(`Should sign out the user when the sign out button is clicked`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000);
        const items = page.locator('ul[data-testid="todos-count"] > li');
        for (let i = 0; i < await items.count(); i++) {
            await items.nth(i).click();
        }

        await page.getByRole("button", {name: "Sign out"}).click();

        await page.waitForTimeout(3000);
        const signIn = await page.getByRole('tab', {name: "Sign In"}).isVisible();
        const email = await page.getByRole('textbox', {name: "Email"}).isVisible();
        const password = await page.getByRole('textbox', {name: "Password"}).isVisible();
        const signInButton = await page.getByRole('button', {name: "Sign In"}).isVisible();

        expect(signIn).toBeTruthy();
        expect(signInButton).toBeTruthy();
        expect(email).toBeTruthy();
        expect(password).toBeTruthy();
    });
})
