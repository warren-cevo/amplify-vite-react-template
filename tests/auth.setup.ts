import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByLabel('Email').fill('warren.abundo+test@cevo.com.au');
    await page.getByLabel('Password', { exact: true }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait until the page receives the cookies.
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('http://localhost:5173');
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});