import { test, expect } from '@playwright/test';
import { ai } from '@zerostep/playwright'

test.describe('Zero-Step tests', () => {
    test(`Should verify that user is authenticated`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        const [add, signOut] = await ai(
            [
                'Get the button with "Add" as a value',
                'Get the button with "Sign out" as a value',
            ],
            { page, test },
            {
                parallelism: 1,
                failImmediately: true
            }
        );

        expect(add).not.toEqual("");
        expect(signOut).not.toEqual("");
    });

    test(`Should add three todos`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000);
        await ai('Clean up the list by click on each list', { page, test })
        await ai([
            'Fill out the form with "eat" as a value. Submit the form by clicking the Add button',
            'Fill out the form with "sleep" as a value. Submit the form by clicking the Add button',
            'Fill out the form with "repeat" as a value. Submit the form by clicking the Add button'
        ], { page, test }, {parallelism: 1,
            failImmediately: true})

        const [eatNumber, sleepNumber, repeatNumber, nothingNumber] = await ai([
            'How many word "eat" on list can you find?',
            'How many word "sleep" on list can you find?',
            'How many word "repeat" on list can you find?',
            'How many word "nothing" on list can you find?'
        ], { page, test });
        expect(parseInt(eatNumber)).toEqual(1);
        expect(parseInt(sleepNumber)).toEqual(1);
        expect(parseInt(repeatNumber)).toEqual(1);
        expect(parseInt(nothingNumber)).toEqual(0);
    });

    test(`Should clear the input textbox after adding a todo`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000);
        await ai('Clean up the list by click on each list', { page, test });
        await ai('Fill out the form with "eat" as a value. Submit the form by clicking the Add button',
            { page, test },
            {
                parallelism: 1,
                failImmediately: true
            });

        const todo = await ai(`Get the inputValue of the todo textbox, make sure it's not the placeholder value`,
            { page, test },
            {
                parallelism: 1,
                failImmediately: true
            }
        );
        expect(todo).toEqual('What are you going to do today?');
    });

    test(`Should sign out the user when the sign out button is clicked`, async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000);
        await ai('Clean up the list by click on each list', { page, test });
        await ai('Click the sign out button', { page, test });

        const [signIn, email, password] = await ai(
            [
                'Get the button with "Sign In" as a value',
                'Get the button with "Email" as a value',
                'Get the button with "Password" as a value',
            ],
            { page, test },
            {
                parallelism: 1,
                failImmediately: true
            }
        );

        expect(signIn).not.toEqual("");
        expect(email).not.toEqual("");
        expect(password).not.toEqual("");
    });
})
