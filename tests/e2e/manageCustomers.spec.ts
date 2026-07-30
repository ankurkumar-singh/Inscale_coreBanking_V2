import { expect, test } from '@playwright/test';
import { AddCustomerPage } from '../../pages/AddCustomerPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { LoginPage } from '../../pages/LoginPage';
import { ManagerPage } from '../../pages/ManagerPage';
import { ExcelReader } from '../../utils/ExcelReader';

test.describe('Q1 - Manage customers', () => {
  test(
    'should create 7 Excel customers, verify records and delete specified customers',
    async ({ page }, testInfo) => {
      const customers = await ExcelReader.getCustomers();

      expect(
        customers,
        'Excel should contain exactly 7 customers',
      ).toHaveLength(7);

      const customersToDelete = customers.filter(
        (customer) =>
          customer.postCode === 'L789C349' &&
          ((customer.firstName === 'Jackson' &&
            customer.lastName === 'Frank') ||
            (customer.firstName === 'Christopher' &&
              customer.lastName === 'Connely')),
      );

      expect(
        customersToDelete,
        'Exactly 2 specified customers should be selected for deletion',
      ).toHaveLength(2);

      const loginPage = new LoginPage(page);
      const managerPage = new ManagerPage(page);
      const addCustomerPage = new AddCustomerPage(page);
      const customersPage = new CustomersPage(page);

      await test.step('Login as Bank Manager', async () => {
        await loginPage.navigate();
        await loginPage.loginAsBankManager();
        await managerPage.verifyManagerDashboard();
      });

      await test.step('Open the Add Customer page', async () => {
        await managerPage.openAddCustomerPage();
        await addCustomerPage.verifyAddCustomerPage();
      });

      for (const customer of customers) {
        await test.step(
          `Create customer: ${customer.firstName} ${customer.lastName}`,
          async () => {
            await addCustomerPage.addCustomer(customer);
          },
        );
      }

      await test.step(
        'Verify all Excel customers in the customer table',
        async () => {
          await managerPage.openCustomersPage();
          await customersPage.verifyCustomersPage();
          await customersPage.verifyAllCustomers(customers);
        },
      );

      for (const customer of customersToDelete) {
        await test.step(
          `Delete and verify customer: ${customer.firstName} ${customer.lastName}`,
          async () => {
            await customersPage.deleteCustomer(customer);
            await customersPage.verifyCustomerDoesNotExist(customer);
          },
        );
      }

      await test.step('Attach final customer table evidence', async () => {
        await testInfo.attach('final-customer-table', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      });
    },
  );
});