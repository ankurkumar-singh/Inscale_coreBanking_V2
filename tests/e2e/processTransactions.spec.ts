import { expect, test } from '@playwright/test';
import { AccountPage } from '../../pages/AccountPage';
import { DepositPage } from '../../pages/DepositPage';
import { LoginPage } from '../../pages/LoginPage';
import { WithdrawPage } from '../../pages/WithdrawPage';
import { BalanceCalculator } from '../../utils/BalanceCalculator';
import { ExcelReader } from '../../utils/ExcelReader';

test.describe('Q2 - Process transactions', () => {
  test('should process Excel transactions and validate the balance', async ({
    page,
  }) => {
    const transactions = await ExcelReader.getTransactions();

    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const depositPage = new DepositPage(page);
    const withdrawPage = new WithdrawPage(page);

    await loginPage.navigate();
    await loginPage.loginAsCustomer('Hermoine Granger');

    await accountPage.verifyAccountPage();
    await accountPage.selectAccount('1003');

    let expectedBalance = await accountPage.getDisplayedBalance();

    for (const transaction of transactions) {
      if (transaction.type === 'Credit') {
        await depositPage.open();
        await depositPage.deposit(transaction.amount);
      } else {
        await withdrawPage.open();
        await withdrawPage.withdraw(transaction.amount);
      }

      expectedBalance = BalanceCalculator.calculateExpectedBalance(
        expectedBalance,
        [transaction],
      );

      await expect
        .poll(async () => accountPage.getDisplayedBalance(), {
          message:
            `Balance should be ${expectedBalance} after ` +
            `${transaction.type} of ${transaction.amount}`,
        })
        .toBe(expectedBalance);
    }
  });
});