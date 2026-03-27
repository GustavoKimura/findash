import { TestBed } from '@angular/core/testing';
import { DashboardViewModel } from './dashboard.viewmodel';
import { TransactionService } from '../core/transaction.service';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '../core/transaction.model';

describe('DashboardViewModel', () => {
  let vm: DashboardViewModel;
  let mockTransactionService: any;

  const mockTransaction: Transaction = {
    id: '1',
    description: 'Teste',
    amount: 100,
    type: 'Despesa',
    category: 'Lazer',
    date: '2026-03-27',
  };

  beforeEach(() => {
    mockTransactionService = {
      transactions: signal([]),
      totalIncome: signal(0),
      totalExpenses: signal(0),
      balance: signal(0),
      expensesByCategory: signal({}),
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        DashboardViewModel,
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    });

    vm = TestBed.inject(DashboardViewModel);
  });

  it('should create', () => {
    expect(vm).toBeTruthy();
  });

  it('should open the add modal and reset the form', () => {
    vm.openAddModal();
    expect(vm.isModalOpen()).toBe(true);
    expect(vm.editingTransaction()).toBeNull();
    expect(vm.form.getRawValue().description).toBe('');
  });

  it('should open the edit modal and patch the form', () => {
    vm.openEditModal(mockTransaction);
    expect(vm.isModalOpen()).toBe(true);
    expect(vm.editingTransaction()).toEqual(mockTransaction);
    expect(vm.form.getRawValue().description).toBe('Teste');
  });

  it('should close the modal and reset editing state', () => {
    vm.openEditModal(mockTransaction);
    vm.closeModal();
    expect(vm.isModalOpen()).toBe(false);
    expect(vm.editingTransaction()).toBeNull();
  });

  it('should call addTransaction on submit when not editing', () => {
    vm.openAddModal();
    vm.form.setValue({
      id: null,
      description: 'Nova Despesa',
      amount: 50,
      type: 'Despesa',
      category: 'Outros',
      date: '2026-03-28',
    });
    vm.submit();
    expect(mockTransactionService.addTransaction).toHaveBeenCalledWith({
      id: null,
      description: 'Nova Despesa',
      amount: 50,
      type: 'Despesa',
      category: 'Outros',
      date: '2026-03-28',
    });
    expect(vm.isModalOpen()).toBe(false);
  });

  it('should call updateTransaction on submit when editing', () => {
    vm.openEditModal(mockTransaction);
    const updatedValue = { ...mockTransaction, description: 'Teste Editado' };
    vm.form.patchValue({ description: 'Teste Editado' });
    vm.submit();
    expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith(updatedValue);
    expect(vm.isModalOpen()).toBe(false);
  });

  it('should not submit an invalid form', () => {
    vm.openAddModal();
    vm.form.setValue({
      id: null,
      description: '',
      amount: null,
      type: 'Despesa',
      category: 'Outros',
      date: '2026-03-28',
    });
    vm.submit();
    expect(mockTransactionService.addTransaction).not.toHaveBeenCalled();
    expect(mockTransactionService.updateTransaction).not.toHaveBeenCalled();
  });

  it('should call deleteTransaction with the correct id', () => {
    vm.delete('123');
    expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith('123');
  });
});
