import { expect, type Locator, type Page } from '@playwright/test';

export class DepositPage {
  private readonly depositTabButton: Locator;
  private readonly amountInput: Locator;
  private readonly depositSubmitButton: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.depositTabButton = page.getByRole('button', {
      name: 'Deposit',
      exact: true,
    }).first();

    this.amountInput = page.getByPlaceholder('amount');

    this.depositSubmitButton = page
      .getByRole('form')
      .getByRole('button', {
        name: 'Deposit',
        exact: true,
      });

    this.confirmationMessage = page.getByText(
      'Deposit Successful',
      { exact: true },
    );
  }

  async open(): Promise<void> {
    await this.depositTabButton.click();

    await expect(this.amountInput).toBeVisible();
    await expect(this.depositSubmitButton).toBeVisible();
  }

  async deposit(amount: number): Promise<void> {
    expect(amount).toBeGreaterThan(0);

    await this.amountInput.fill(amount.toString());
    await this.depositSubmitButton.click();

    await expect(this.confirmationMessage).toBeVisible();
    await expect(this.amountInput).toHaveValue('');
  }
}