import { expect, test } from '@playwright/test';
import { AccountPage } from '../../pages/AccountPage';
import { DepositPage } from '../../pages/DepositPage';
import { LoginPage } from '../../pages/LoginPage';
import { WithdrawPage } from '../../pages/WithdrawPage';
import { BalanceCalculator } from '../../utils/BalanceCalculator';
import { ExcelReader } from '../../utils/ExcelReader';

test.describe('Q2 - Process transactions', () => {
  test(
    'should process 7 Excel transactions and validate account 1003 balance',
    async ({ page }, testInfo) => {
      const customerName = 'Hermoine Granger';
      const accountNumber = '1003';

      const transactions = await ExcelReader.getTransactions();

      expect(
        transactions,
        'Excel should contain exactly 7 transactions',
      ).toHaveLength(7);

      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const depositPage = new DepositPage(page);
      const withdrawPage = new WithdrawPage(page);

      await test.step(`Login as customer: ${customerName}`, async () => {
        await loginPage.navigate();
        await loginPage.loginAsCustomer(customerName);
        await accountPage.verifyAccountPage();
      });

      const startingBalance = await test.step(
        `Select account ${accountNumber} and capture starting balance`,
        async () => {
          await accountPage.selectAccount(accountNumber);

          const displayedBalance =
            await accountPage.getDisplayedBalance();

          expect(
            Number.isFinite(displayedBalance),
            'Starting balance should be a valid number',
          ).toBeTruthy();

          return displayedBalance;
        },
      );

      let expectedBalance = startingBalance;

      for (const [index, transaction] of transactions.entries()) {
        await test.step(
          `Transaction ${index + 1}: ${transaction.type} ${transaction.amount}`,
          async () => {
            const nextExpectedBalance =
              BalanceCalculator.calculateExpectedBalance(
                expectedBalance,
                [transaction],
              );

            if (transaction.type === 'Credit') {
              await depositPage.open();
              await depositPage.deposit(transaction.amount);
            } else if (transaction.type === 'Debit') {
              await withdrawPage.open();
              await withdrawPage.withdraw(transaction.amount);
            } else {
              throw new Error(
                `Unsupported transaction type: ${transaction.type}`,
              );
            }

            await expect
              .poll(() => accountPage.getDisplayedBalance(), {
                message:
                  `Balance should be ${nextExpectedBalance} after ` +
                  `${transaction.type} of ${transaction.amount}`,
              })
              .toBe(nextExpectedBalance);

            expectedBalance = nextExpectedBalance;
          },
        );
      }

      const finalDisplayedBalance = await test.step(
        'Verify the final account balance',
        async () => {
          const displayedBalance =
            await accountPage.getDisplayedBalance();

          expect(
            displayedBalance,
            'Final displayed balance should match the calculated balance',
          ).toBe(expectedBalance);

          return displayedBalance;
        },
      );

      await test.step('Attach final transaction evidence', async () => {
        await testInfo.attach('final-account-balance', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });

        await testInfo.attach('transaction-summary', {
          body: Buffer.from(
            JSON.stringify(
              {
                customerName,
                accountNumber,
                startingBalance,
                transactionsProcessed: transactions.length,
                finalExpectedBalance: expectedBalance,
                finalDisplayedBalance,
              },
              null,
              2,
            ),
          ),
          contentType: 'application/json',
        });
      });
    },
  );
});