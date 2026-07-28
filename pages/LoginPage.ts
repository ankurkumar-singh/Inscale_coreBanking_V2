import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly bankManagerLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bankManagerLoginButton = page.getByRole('button', {
      name: 'Bank Manager Login',
      exact: true,
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto('./#/login');

    await expect(this.bankManagerLoginButton).toBeVisible();
  }

  async loginAsBankManager(): Promise<void> {
    await this.bankManagerLoginButton.click();

    await expect(this.page).toHaveURL(/#\/manager$/);
  }
}