import { expect, test } from '@playwright/test';
import { AddCustomerPage } from '../../pages/AddCustomerPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { LoginPage } from '../../pages/LoginPage';
import { ManagerPage } from '../../pages/ManagerPage';
import type { Customer } from '../../models/Customer';
import { ExcelReader } from '../../utils/ExcelReader';

function isSameCustomer(
  firstCustomer: Customer,
  secondCustomer: Customer,
): boolean {
  return (
    firstCustomer.firstName === secondCustomer.firstName &&
    firstCustomer.lastName === secondCustomer.lastName &&
    firstCustomer.postCode === secondCustomer.postCode
  );
}

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

      const remainingCustomers = customers.filter(
        (customer) =>
          !customersToDelete.some((customerToDelete) =>
            isSameCustomer(customer, customerToDelete),
          ),
      );

      expect(
        remainingCustomers,
        'Exactly 5 customers should remain after deletion',
      ).toHaveLength(5);

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

      const postCodesBeforeDeletion = [
        ...new Set(customers.map((customer) => customer.postCode)),
      ];

      for (const postCode of postCodesBeforeDeletion) {
        const expectedCustomers = customers.filter(
          (customer) => customer.postCode === postCode,
        );

        await test.step(
          `Attach customers before deletion for postcode ${postCode}`,
          async () => {
            await testInfo.attach(
              `customers-before-deletion-${postCode}`,
              {
                body:
                  await customersPage.captureFilteredCustomerTable(
                    postCode,
                    expectedCustomers.length,
                  ),
                contentType: 'image/png',
              },
            );
          },
        );
      }

      for (const customer of customersToDelete) {
        await test.step(
          `Delete and verify customer: ${customer.firstName} ${customer.lastName}`,
          async () => {
            await customersPage.deleteCustomer(customer);
            await customersPage.verifyCustomerDoesNotExist(customer);
          },
        );
      }

      const postCodesAfterDeletion = [
        ...new Set(
          remainingCustomers.map((customer) => customer.postCode),
        ),
      ];

      for (const postCode of postCodesAfterDeletion) {
        const expectedCustomers = remainingCustomers.filter(
          (customer) => customer.postCode === postCode,
        );

        await test.step(
          `Attach customers after deletion for postcode ${postCode}`,
          async () => {
            await testInfo.attach(
              `customers-after-deletion-${postCode}`,
              {
                body:
                  await customersPage.captureFilteredCustomerTable(
                    postCode,
                    expectedCustomers.length,
                  ),
                contentType: 'image/png',
              },
            );
          },
        );
      }
    },
  );
});
