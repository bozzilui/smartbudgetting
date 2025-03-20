// app/(tabs)/types/transaction.ts
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export type NewTransaction = Omit<Transaction, 'id'>;