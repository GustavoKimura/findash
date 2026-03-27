import { TestBed } from '@angular/core/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let storage: { [key: string]: string };

  const mockTransactions: Omit<Transaction, 'id'>[] = [
    {
      description: 'Salário',
      amount: 5000,
      type: 'Receita',
      category: 'Salário',
      date: '2026-03-27',
    },
    {
      description: 'Aluguel',
      amount: 1500,
      type: 'Despesa',
      category: 'Moradia',
      date: '2026-03-26',
    },
    {
      description: 'Supermercado',
      amount: 300,
      type: 'Despesa',
      category: 'Alimentação',
      date: '2026-03-25',
    },
  ];

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      storage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => storage[key] ?? null);
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      storage = {};
    });

    TestBed.configureTestingModule({
      providers: [TransactionService],
    });
    service = TestBed.inject(TransactionService);

    localStorage.clear();
    (service as any).transactionsState.set([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load transactions from localStorage on initialization', () => {
    storage['transactions'] = JSON.stringify([{ ...mockTransactions[0], id: '1' }]);
    const newService = new TransactionService();
    expect(newService.transactions()).toEqual([{ ...mockTransactions[0], id: '1' }]);
  });

  it('should add a transaction', () => {
    const newTransaction: Omit<Transaction, 'id'> = {
      description: 'Freelance',
      amount: 800,
      type: 'Receita',
      category: 'Outros',
      date: '2026-03-28',
    };
    service.addTransaction(newTransaction);
    const transactions = service.transactions();
    expect(transactions.length).toBe(1);
    expect(transactions[0].description).toBe('Freelance');
    expect(localStorage.setItem).toHaveBeenCalledWith('transactions', expect.any(String));
  });

  it('should update a transaction', () => {
    service.addTransaction(mockTransactions[1]);
    const addedTransaction = service.transactions()[0];
    const updatedTransaction: Transaction = {
      ...addedTransaction,
      amount: 1600,
    };

    service.updateTransaction(updatedTransaction);

    const transaction = service.transactions().find((t) => t.id === addedTransaction.id);
    expect(transaction?.amount).toBe(1600);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('should delete a transaction', () => {
    mockTransactions.forEach((t) => service.addTransaction(t));
    expect(service.transactions().length).toBe(3);
    const idToDelete = service.transactions()[1].id;

    service.deleteTransaction(idToDelete);

    const transactions = service.transactions();
    expect(transactions.length).toBe(2);
    expect(transactions.find((t) => t.id === idToDelete)).toBeUndefined();
  });

  it('should compute totalIncome correctly', () => {
    mockTransactions.forEach((t) => service.addTransaction(t));
    expect(service.totalIncome()).toBe(5000);
  });

  it('should compute totalExpenses correctly', () => {
    mockTransactions.forEach((t) => service.addTransaction(t));
    expect(service.totalExpenses()).toBe(1800);
  });

  it('should compute balance correctly', () => {
    mockTransactions.forEach((t) => service.addTransaction(t));
    expect(service.balance()).toBe(3200);
  });

  it('should compute expensesByCategory correctly', () => {
    const extraExpenses = [
      ...mockTransactions,
      {
        description: 'Cinema',
        amount: 50,
        type: 'Despesa' as const,
        category: 'Lazer' as const,
        date: '2026-03-24',
      },
      {
        description: 'Restaurante',
        amount: 120,
        type: 'Despesa' as const,
        category: 'Alimentação' as const,
        date: '2026-03-23',
      },
    ];

    extraExpenses.forEach((t) => service.addTransaction(t));

    const expectedCategories = {
      Moradia: 1500,
      Alimentação: 420,
      Lazer: 50,
    };
    expect(service.expensesByCategory()).toEqual(expectedCategories);
  });
});
