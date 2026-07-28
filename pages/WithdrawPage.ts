import { expect, type Locator, type Page } from '@playwright/test';

export class WithdrawPage {
  private readonly withdrawTabButton: Locator;
  private readonly amountInput: Locator;
  private readonly withdrawSubmitButton: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.withdrawTabButton = page.getByRole('button', {
      name: 'Withdrawl',
      exact: true,
    });

    this.amountInput = page.getByPlaceholder('amount');

    this.withdrawSubmitButton = page
      .getByRole('form')
      .getByRole('button', {
        name: 'Withdraw',
        exact: true,
      });

    this.confirmationMessage = page.getByText(
      'Transaction successful',
      { exact: true },
    );
  }

  async open(): Promise<void> {
    await this.withdrawTabButton.click();

    await expect(this.amountInput).toBeVisible();
    await expect(this.withdrawSubmitButton).toBeVisible();
  }

  async withdraw(amount: number): Promise<void> {
    expect(amount).toBeGreaterThan(0);

    await this.amountInput.fill(amount.toString());
    await this.withdrawSubmitButton.click();

    await expect(this.confirmationMessage).toBeVisible();
    await expect(this.amountInput).toHaveValue('');
  }
}