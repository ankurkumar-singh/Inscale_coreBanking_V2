import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly bankManagerLoginButton: Locator;
  private readonly customerLoginButton: Locator;
  private readonly customerSelect: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.bankManagerLoginButton = page.getByRole('button', {
      name: 'Bank Manager Login',
      exact: true,
    });

    this.customerLoginButton = page.getByRole('button', {
      name: 'Customer Login',
      exact: true,
    });

    this.customerSelect = page.getByRole('combobox');

    this.loginButton = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto('./#/login');

    await expect(this.customerLoginButton).toBeVisible();
    await expect(this.bankManagerLoginButton).toBeVisible();
  }

  async loginAsBankManager(): Promise<void> {
    await this.bankManagerLoginButton.click();

    await expect(this.page).toHaveURL(/#\/manager$/);
  }

  async loginAsCustomer(customerName: string): Promise<void> {
    await this.customerLoginButton.click();

    await expect(this.page).toHaveURL(/#\/customer$/);
    await expect(this.customerSelect).toBeVisible();

    await this.customerSelect.selectOption({
      label: customerName,
    });

    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();

    await expect(this.page).toHaveURL(/#\/account$/);
  }
}