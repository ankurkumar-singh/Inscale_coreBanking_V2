import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer } from '../models/Customer';

export class CustomersPage {
  private readonly page: Page;
  private readonly searchInput: Locator;
  private readonly customerTable: Locator;
  private readonly customerRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search Customer');
    this.customerTable = page.locator('table');
    this.customerRows = this.customerTable.locator('tbody tr');
  }

  private getCustomerRow(customer: Customer): Locator {
    return this.customerRows
      .filter({
        has: this.page.locator('td:nth-child(1)', {
          hasText: customer.firstName,
        }),
      })
      .filter({
        has: this.page.locator('td:nth-child(2)', {
          hasText: customer.lastName,
        }),
      })
      .filter({
        has: this.page.locator('td:nth-child(3)', {
          hasText: customer.postCode,
        }),
      });
  }

  async verifyCustomersPage(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.customerTable).toBeVisible();
    await expect(this.customerRows.first()).toBeVisible();
  }

  async verifyCustomerExists(customer: Customer): Promise<void> {
    await this.searchInput.fill(customer.firstName);

    const customerRow = this.getCustomerRow(customer);

    await expect(customerRow).toHaveCount(1);
    await expect(customerRow).toBeVisible();

    const cells = customerRow.locator('td');

    await expect(cells.nth(0)).toHaveText(customer.firstName);
    await expect(cells.nth(1)).toHaveText(customer.lastName);
    await expect(cells.nth(2)).toHaveText(customer.postCode);

    await this.searchInput.clear();
  }

  async verifyAllCustomers(
    customers: readonly Customer[],
  ): Promise<void> {
    for (const customer of customers) {
      await this.verifyCustomerExists(customer);
    }
  }

  async deleteCustomer(customer: Customer): Promise<void> {
    await this.searchInput.fill(customer.firstName);

    const customerRow = this.getCustomerRow(customer);

    await expect(customerRow).toHaveCount(1);
    await expect(customerRow).toBeVisible();

    await customerRow
      .getByRole('button', {
        name: 'Delete',
        exact: true,
      })
      .click();

    await expect(customerRow).toHaveCount(0);
    await this.searchInput.clear();
  }

  async verifyCustomerDoesNotExist(
    customer: Customer,
  ): Promise<void> {
    await this.searchInput.fill(customer.firstName);

    const customerRow = this.getCustomerRow(customer);

    await expect(customerRow).toHaveCount(0);

    await this.searchInput.clear();
  }

  async captureFilteredCustomerTable(
    postCode: string,
    expectedRowCount: number,
  ): Promise<Buffer> {
    await this.searchInput.fill(postCode);

    await expect(this.customerRows).toHaveCount(expectedRowCount);
    await expect(this.customerRows.first()).toBeVisible();
    await expect(this.customerTable).toBeVisible();

    const screenshot = await this.customerTable.screenshot();

    await this.searchInput.clear();

    return screenshot;
  }
}
