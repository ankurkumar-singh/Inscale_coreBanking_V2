import { expect, type Locator, type Page } from '@playwright/test';

export class AccountPage {
  private readonly accountSelect: Locator;
  private readonly accountDetails: Locator;
  private readonly transactionsButton: Locator;
  private readonly depositButton: Locator;
  private readonly withdrawButton: Locator;

  constructor(page: Page) {
    this.accountSelect = page.locator('#accountSelect');

    this.accountDetails = page
      .locator('.center')
      .filter({ hasText: 'Account Number' });

    this.transactionsButton = page.getByRole('button', {
      name: 'Transactions',
      exact: true,
    });

    this.depositButton = page.getByRole('button', {
      name: 'Deposit',
      exact: true,
    });

    this.withdrawButton = page.getByRole('button', {
      name: 'Withdrawl',
      exact: true,
    });
  }

  async verifyAccountPage(): Promise<void> {
    await expect(this.accountSelect).toBeVisible();
    await expect(this.transactionsButton).toBeVisible();
    await expect(this.depositButton).toBeVisible();
    await expect(this.withdrawButton).toBeVisible();
  }

  async selectAccount(accountNumber: string): Promise<void> {
    await this.accountSelect.selectOption({
      label: accountNumber,
    });

    await expect(this.accountDetails).toContainText(accountNumber);
  }

  async getDisplayedBalance(): Promise<number> {
    const balanceText = await this.accountDetails
      .locator('strong.ng-binding')
      .nth(1)
      .innerText();

    const balance = Number(balanceText.trim());

    expect(Number.isFinite(balance)).toBeTruthy();

    return balance;
  }
}