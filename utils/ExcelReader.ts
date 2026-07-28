import path from 'node:path';
import { parseSheetData, readSheet } from 'read-excel-file/node';
import type { Schema, SheetData } from 'read-excel-file/node';
import type { Customer } from '../models/Customer';
import type { Transaction } from '../models/Transaction';

type CustomerColumn = 'First Name' | 'Last Name' | 'Postcode';
type TransactionColumn = 'Amount' | 'Type';

const workbookPath = path.resolve(
  process.cwd(),
  'test-data',
  'TestData.xlsx',
);

const customerSchema: Schema<Customer, CustomerColumn> = {
  firstName: {
    column: 'First Name',
    type: String,
    required: true,
  },
  lastName: {
    column: 'Last Name',
    type: String,
    required: true,
  },
  postCode: {
    column: 'Postcode',
    type: String,
    required: true,
  },
};

const transactionSchema: Schema<Transaction, TransactionColumn> = {
  amount: {
    column: 'Amount',
    type: Number,
    required: true,
    validate: (amount) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Amount must be greater than zero.');
      }
    },
  },
  type: {
    column: 'Type',
    type: String,
    oneOf: ['Credit', 'Debit'],
    required: true,
  },
};

function parseRows<T extends object, C extends string>(
  rows: SheetData,
  schema: Schema<T, C>,
  sheetName: string,
): T[] {
  const result = parseSheetData<T, C>(rows, schema);

  if (result.errors) {
    const details = result.errors
      .map(
        (error) =>
          `row ${error.row}, column "${error.column}": ${error.error}`,
      )
      .join('; ');

    throw new Error(`Invalid data in "${sheetName}" sheet: ${details}`);
  }

  if (result.objects.length === 0) {
    throw new Error(`No test data found in "${sheetName}" sheet.`);
  }

  return result.objects;
}

export class ExcelReader {
  static async getCustomers(): Promise<Customer[]> {
    const rows = await readSheet(workbookPath, 'Customers');
    return parseRows(rows, customerSchema, 'Customers');
  }

  static async getTransactions(): Promise<Transaction[]> {
    const rows = await readSheet(workbookPath, 'Transactions');
    return parseRows(rows, transactionSchema, 'Transactions');
  }
}