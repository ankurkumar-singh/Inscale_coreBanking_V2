import type { Transaction } from '../models/Transaction';

export class BalanceCalculator {
  static calculateExpectedBalance(
    initialBalance: number,
    transactions: readonly Transaction[],
  ): number {
    if (!Number.isFinite(initialBalance)) {
      throw new Error('Initial balance must be a valid number.');
    }

    return transactions.reduce((currentBalance, transaction) => {
      if (!Number.isFinite(transaction.amount) || transaction.amount <= 0) {
        throw new Error('Transaction amount must be greater than zero.');
      }

      return transaction.type === 'Credit'
        ? currentBalance + transaction.amount
        : currentBalance - transaction.amount;
    }, initialBalance);
  }
}