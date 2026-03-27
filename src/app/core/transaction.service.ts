import { computed, Injectable, signal } from '@angular/core';
import { Transaction } from './transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly storageKey = 'transactions';
  private transactionsState = signal<Transaction[]>([]);

  public transactions = this.transactionsState.asReadonly();

  public totalIncome = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'Receita')
      .reduce((acc, t) => acc + t.amount, 0),
  );

  public totalExpenses = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'Despesa')
      .reduce((acc, t) => acc + t.amount, 0),
  );

  public balance = computed(() => this.totalIncome() - this.totalExpenses());

  public expensesByCategory = computed(() => {
    const expenses = this.transactions().filter((t) => t.type === 'Despesa');
    const categoryMap = new Map<string, number>();

    for (const expense of expenses) {
      const currentTotal = categoryMap.get(expense.category) ?? 0;
      categoryMap.set(expense.category, currentTotal + expense.amount);
    }

    return Object.fromEntries(categoryMap);
  });

  constructor() {
    this.loadFromLocalStorage();
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    this.transactionsState.update((transactions) => [
      ...transactions,
      { ...transaction, id: crypto.randomUUID() },
    ]);
    this.saveToLocalStorage();
  }

  deleteTransaction(id: string): void {
    this.transactionsState.update((transactions) => transactions.filter((t) => t.id !== id));
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions()));
  }

  private loadFromLocalStorage(): void {
    const storedTransactions = localStorage.getItem(this.storageKey);
    if (storedTransactions) {
      this.transactionsState.set(JSON.parse(storedTransactions));
    }
  }
}
