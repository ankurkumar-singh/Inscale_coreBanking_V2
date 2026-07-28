import { expect, type Locator, type Page } from '@playwright/test';

export class ManagerPage {
  private readonly page: Page;
  private readonly addCustomerButton: Locator;
  private readonly openAccountButton: Locator;
  private readonly customersButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addCustomerButton = page.getByRole('button', {
      name: 'Add Customer',
      exact: true,
    });

    this.openAccountButton = page.getByRole('button', {
      name: 'Open Account',
      exact: true,
    });

    this.customersButton = page.getByRole('button', {
      name: 'Customers',
      exact: true,
    });
  }

  async verifyManagerDashboard(): Promise<void> {
    await expect(this.addCustomerButton).toBeVisible();
    await expect(this.openAccountButton).toBeVisible();
    await expect(this.customersButton).toBeVisible();
  }

  async openAddCustomerPage(): Promise<void> {
    await this.addCustomerButton.click();
    await expect(this.page).toHaveURL(/#\/manager\/addCust$/);
  }

  async openCustomersPage(): Promise<void> {
    await this.customersButton.click();
    await expect(this.page).toHaveURL(/#\/manager\/list$/);
  }
}