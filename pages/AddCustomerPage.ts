import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer } from '../models/Customer';

export class AddCustomerPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postCodeInput: Locator;
  private readonly addCustomerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postCodeInput = page.getByPlaceholder('Post Code');

    this.addCustomerButton = page.getByRole('form')  .getByRole('button', {
    name: 'Add Customer',
    exact: true,
  });
  }

  async verifyAddCustomerPage(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postCodeInput).toBeVisible();
    await expect(this.addCustomerButton).toBeVisible();
  }

  async addCustomer(customer: Customer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postCodeInput.fill(customer.postCode);

    const [dialogMessage] = await Promise.all([
      this.page.waitForEvent('dialog').then(async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        return message;
      }),
      this.addCustomerButton.click(),
    ]);

    expect(dialogMessage).toMatch(
      /Customer added successfully with customer id\s*:\s*\d+/i,
    );
  }
}