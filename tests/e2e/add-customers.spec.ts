import { test } from '@playwright/test';
import { AddCustomerPage } from '../../pages/AddCustomerPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { LoginPage } from '../../pages/LoginPage';
import { ManagerPage } from '../../pages/ManagerPage';
import { ExcelReader } from '../../utils/ExcelReader';

test.describe('Q1 - Add customers', () => {
  test('should add all Excel customers and verify them', async ({ page }) => {
    const customers = await ExcelReader.getCustomers();

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
    
  });
});