import { expect, test } from '@playwright/test';
import { AddCustomerPage } from '../../pages/AddCustomerPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { LoginPage } from '../../pages/LoginPage';
import { ManagerPage } from '../../pages/ManagerPage';
import { ExcelReader } from '../../utils/ExcelReader';

test.describe('Q1 - Manage customers', () => {
  test('should add, verify and delete Excel customers', async ({ page }) => {
    const customers = await ExcelReader.getCustomers();

    const customersToDelete = customers.filter(
      (customer) =>
        customer.postCode === 'L789C349' &&
        (
          (customer.firstName === 'Jackson' &&
            customer.lastName === 'Frank') ||
          (customer.firstName === 'Christopher' &&
            customer.lastName === 'Connely')
        ),
    );

    expect(customersToDelete).toHaveLength(2);

    const loginPage = new LoginPage(page);
    const managerPage = new ManagerPage(page);
    const addCustomerPage = new AddCustomerPage(page);
    const customersPage = new CustomersPage(page);

    await loginPage.navigate();
    await loginPage.loginAsBankManager();
    await managerPage.verifyManagerDashboard();

    await managerPage.openAddCustomerPage();
    await addCustomerPage.verifyAddCustomerPage();

    for (const customer of customers) {
      await addCustomerPage.addCustomer(customer);
    }

    await managerPage.openCustomersPage();
    await customersPage.verifyCustomersPage();
    await customersPage.verifyAllCustomers(customers);

    for (const customer of customersToDelete) {
      await customersPage.deleteCustomer(customer);
    }

    for (const customer of customersToDelete) {
      await customersPage.verifyCustomerDoesNotExist(customer);
    }
  });
});