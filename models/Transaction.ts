export type TransactionType = 'Credit' | 'Debit';

export interface Transaction {
  readonly amount: number;
  readonly type: TransactionType;
}