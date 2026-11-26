import { test, expect } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach('Установка тестовых токенов, подключение HAR и загрузка ингредиентов', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test_access_token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test_refresh_token');
    });

    await page.routeFromHAR('./tests/hars/api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.goto('/');

    await expect(page.locator('a[href^="/ingredients/"]').first()).toBeVisible();
  });
  test.describe('Добавление ингредиентов в конструктор', () => {
    test('Добавление булки в конструктор', async ({ page }) => {
      const bunName = 'Краторная булка N-200i';
      const constructor = page.getByTestId('burger-constructor');

      await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(
        2
      );

      const bunCard = page.getByRole('listitem').filter({
        has: page.getByText(bunName, { exact: true }),
      });

      await bunCard.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        constructor.getByText(`${bunName} (верх)`, { exact: true })
      ).toBeVisible();
      await expect(
        constructor.getByText(`${bunName} (низ)`, { exact: true })
      ).toBeVisible();
      await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(
        0
      );
    });

    test('Добавление ингредиентов', async ({ page }) => {
      const ingredientName = 'Говяжий метеорит (отбивная)';
      const constructor = page.getByTestId('burger-constructor');

      await expect(
        constructor.getByText('Выберите начинку', { exact: true })
      ).toBeVisible();

      const ingredientCard = page.getByRole('listitem').filter({
        has: page.getByText(ingredientName, { exact: true }),
      });

      await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
      await expect(constructor.getByText(ingredientName, { exact: true })).toBeVisible();
      await expect(
        constructor.getByText('Выберите начинку', { exact: true })
      ).toHaveCount(0);
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    test.beforeEach(async ({ page }) => {
      await expect(page.getByTestId('modal')).toHaveCount(0);
      await page.getByText(ingredientName, { exact: true }).click();
      await expect(page.getByTestId('modal')).toBeVisible();
    });

    test('Открытие модального окна ингридиента', async ({ page }) => {
      const modal = page.getByTestId('modal');

      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();
      await expect(modal.getByText(ingredientName, { exact: true })).toBeVisible();
    });

    test('Закрытие модального окна по крестику', async ({ page }) => {
      await page.getByTestId('modal').getByRole('button', { name: 'Закрыть' }).click();
      await expect(page.getByTestId('modal')).toHaveCount(0);
      await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
    });

    test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
      await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
      await expect(page.getByTestId('modal')).toHaveCount(0);
      await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
    });
  });

  test.describe('Создание заказа', () => {
    test('Создание заказа с моковыми данными и очистка конструктора после создания заказа', async ({
      page,
    }) => {
      await expect(
        page.getByRole('link', { name: 'Test User', exact: true })
      ).toBeVisible();

      const orderNumber = 12345;
      const bunName = 'Краторная булка N-200i';
      const ingredientName = 'Говяжий метеорит (отбивная)';
      const constructor = page.getByTestId('burger-constructor');

      const bunCard = page.getByRole('listitem').filter({
        has: page.getByText(bunName, { exact: true }),
      });
      await bunCard.getByRole('button', { name: 'Добавить' }).click();

      const ingredientCard = page.getByRole('listitem').filter({
        has: page.getByText(ingredientName, { exact: true }),
      });
      await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        constructor.getByText(`${bunName} (верх)`, { exact: true })
      ).toBeVisible();
      await expect(
        constructor.getByText(`${bunName} (низ)`, { exact: true })
      ).toBeVisible();
      await expect(constructor.getByText(ingredientName, { exact: true })).toBeVisible();

      await expect(page.getByTestId('modal')).toHaveCount(0);

      await constructor.getByRole('button', { name: 'Оформить заказ' }).click();

      const modal = page.getByTestId('modal');

      await expect(modal).toBeVisible();
      await expect(
        modal.getByRole('heading', { name: String(orderNumber), exact: true })
      ).toBeVisible();

      await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(
        2
      );
      await expect(
        constructor.getByText('Выберите начинку', { exact: true })
      ).toHaveCount(1);
      await expect(
        constructor.getByText(`${bunName} (верх)`, { exact: true })
      ).toHaveCount(0);
      await expect(
        constructor.getByText(`${bunName} (низ)`, { exact: true })
      ).toHaveCount(0);
      await expect(constructor.getByText(ingredientName, { exact: true })).toHaveCount(
        0
      );

      await modal.getByRole('button', { name: 'Закрыть' }).click();
      await expect(modal).toHaveCount(0);
      await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
    });
  });
});
