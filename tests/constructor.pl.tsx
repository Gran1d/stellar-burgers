import { test, expect } from '@playwright/test';

test.describe("Страница конструктора бургера", () => {
    test.beforeEach('Загрузка ингридиентов из HAR', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/api/ingredients',
        update: false, // Режим записи
    });

    await page.goto('/');
    await expect(page.locator('a[href^="/ingredients/"]').first()).toBeVisible();
    });
    test.describe("Добавление ингридиентов в конструктор", () => {
        test("Добавление булоки в конструктор", async ({ page }) => {
        const bunName = "Краторная булка N-200i";
        const constructor = page.getByTestId('burger-constructor');

        await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(2);

        const bunCard = page.getByRole('listitem').filter({
            has: page.getByText(bunName, { exact: true }),
        });

        await bunCard.getByRole("button", { name: "Добавить" }).click();

        await expect(constructor.getByText(`${bunName} (верх)`, { exact: true })).toBeVisible();
        await expect(constructor.getByText(`${bunName} (низ)`, { exact: true })).toBeVisible();
        await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(0);
    });

    test("Добавление ингридиентов", async ({ page }) => {
        const ingredientName = "Говяжий метеорит (отбивная)"
        const constructor = page.getByTestId('burger-constructor');

        await expect(constructor.getByText('Выберите начинку', { exact: true })).toBeVisible();

        const ingredientCard = page.getByRole('listitem').filter({
            has: page.getByText(ingredientName, { exact: true }),
        });

        await ingredientCard.getByRole("button", { name: "Добавить" }).click();
        await expect(constructor.getByText(ingredientName, { exact: true })).toBeVisible();
        await expect(constructor.getByText('Выберите начинку', { exact: true })).toHaveCount(0);
    });
    });

    test.describe("Модальное окно ингридиента", () => {
        const ingredientName = "Биокотлета из марсианской Магнолии";

        test.beforeEach(async ({ page }) => {
            await page.getByText(ingredientName, { exact: true }).click();
            await expect(page.getByTestId('modal')).toBeVisible();
        });

        test("Открытие модального окна ингридиента", async ({ page }) => {
            const modal = page.getByTestId('modal');
            
            await expect(modal.getByRole("heading", { name: "Детали ингредиента"})).toBeVisible();
            await expect(modal.getByText(ingredientName, { exact: true })).toBeVisible();
        });

        test("Закрытие модального окна по крестику", async ({ page }) => {
            await page.getByTestId('modal').getByRole("button", { name: "Закрыть" }).click();
            await expect(page.getByTestId("modal")).toHaveCount(0); 
            await expect(page.getByTestId("modal-overlay")).toHaveCount(0); 
        });

        test("закрытие модального окна по клику на оверлей", async ({ page }) => {
            await page.getByTestId('modal-overlay').click({position: { x: 5, y: 5 }});
            await expect(page.getByTestId("modal")).toHaveCount(0); 
            await expect(page.getByTestId("modal-overlay")).toHaveCount(0); 
        });
    });

    test.describe("Создание заказа", () => {
        test("Создание заказа с моковыми данными и очистка конструктора после создания заказа", async ({ page, context }) => {
            const userResponseMock = {
                "success": true,
                "user": {
                    "email": "test@example.com",
                    "name": "Test User"
                }
            }

            const bunId = "6acd6b8163765e371c0bd9eb";
            const ingredientId = "6acd6b8163765e9acf0bd9ef";

            const orderResponseMock = {
                success: true,
                name: "Тестовый бургер",
                order: {
                    _id: "test_order_id",
                    status: "done",
                    name: "Тестовый бургер",
                    createdAt: "2026-01-01T12:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                    number: 12345,
                    ingredients: [bunId, ingredientId, bunId]
                }
            }

            await context.addCookies([{
                name: "accessToken",
                value: "Bearer test_access_token",
                domain: "localhost",
                path: "/"
            }])

            await page.addInitScript( () => {
                localStorage.setItem('refreshToken', 'test_refresh_token');
            })

            await page.route('**/api/auth/user', async (route) => {
                await route.fulfill({ json: userResponseMock });
            });

            await page.route('**/api/orders', async (route) => {
                await route.fulfill({ json: orderResponseMock });
            });

            await page.reload();

            await expect(page.getByRole("link", {name: userResponseMock.user.name, exact: true})).toBeVisible();

            const bunName = "Краторная булка N-200i";
            const ingredientName = "Говяжий метеорит (отбивная)";
            const constructor = page.getByTestId('burger-constructor');

            const bunCard = page.getByRole('listitem').filter({
                has: page.getByText(bunName, { exact: true }),
            });
            await bunCard.getByRole("button", { name: "Добавить" }).click();

            const ingredientCard = page.getByRole('listitem').filter({
                has: page.getByText(ingredientName, { exact: true }),
            });
            await ingredientCard.getByRole("button", { name: "Добавить" }).click();

            await expect(constructor.getByText(`${bunName} (верх)`, { exact: true })).toBeVisible();
            await expect(constructor.getByText(`${bunName} (низ)`, { exact: true })).toBeVisible();
            await expect(constructor.getByText(ingredientName, { exact: true })).toBeVisible();

            await constructor.getByRole("button", {name: "Оформить заказ"}).click();

            const modal = page.getByTestId("modal");

            await expect(modal).toBeVisible();
            await expect(modal.getByRole("heading", {name: String(orderResponseMock.order.number), exact: true})).toBeVisible();

            await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(2);
            await expect(constructor.getByText('Выберите начинку', { exact: true })).toHaveCount(1);
            await expect(constructor.getByText(`${bunName} (верх)`, { exact: true })).toHaveCount(0);
            await expect(constructor.getByText(`${bunName} (низ)`, { exact: true })).toHaveCount(0);
            await expect(constructor.getByText(ingredientName, { exact: true })).toHaveCount(0);

            await modal.getByRole("button", { name: "Закрыть" }).click();
            await expect(modal).toHaveCount(0); 
            await expect(page.getByTestId("modal-overlay")).toHaveCount(0); 

        });
    });
}); 
