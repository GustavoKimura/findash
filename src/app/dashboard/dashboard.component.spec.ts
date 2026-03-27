import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { TransactionService } from '../core/transaction.service';
import { signal, WritableSignal } from '@angular/core';
import { Transaction } from '../core/transaction.model';

class MockTransactionService {
  transactions: WritableSignal<Transaction[]> = signal([]);
  totalIncome = signal(0);
  totalExpenses = signal(0);
  balance = signal(0);
  expensesByCategory = signal({});
  addTransaction = vi.fn();
  updateTransaction = vi.fn();
  deleteTransaction = vi.fn();
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockTransactionService: MockTransactionService;

  const mockTransaction: Transaction = {
    id: '1',
    description: 'Teste',
    amount: 100,
    type: 'Despesa',
    category: 'Lazer',
    date: '2026-03-27',
  };

  beforeEach(async () => {
    mockTransactionService = new MockTransactionService();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the add modal and reset the form', () => {
    component.openAddModal();
    expect(component.isAddModalOpen()).toBe(true);
    expect(component.editingTransaction()).toBeNull();
    expect(component.transactionForm.getRawValue().description).toBe('');
  });

  it('should open the edit modal and patch the form', () => {
    component.openEditModal(mockTransaction);
    expect(component.isAddModalOpen()).toBe(true);
    expect(component.editingTransaction()).toEqual(mockTransaction);
    expect(component.transactionForm.getRawValue().description).toBe('Teste');
  });

  it('should close the modal and reset editing state', () => {
    component.openEditModal(mockTransaction);
    component.closeModal();
    expect(component.isAddModalOpen()).toBe(false);
    expect(component.editingTransaction()).toBeNull();
  });

  it('should call addTransaction on submit when not editing', () => {
    component.openAddModal();
    component.transactionForm.setValue({
      id: null,
      description: 'Nova Despesa',
      amount: 50,
      type: 'Despesa',
      category: 'Outros',
      date: '2026-03-28',
    });
    component.submitTransaction();
    expect(mockTransactionService.addTransaction).toHaveBeenCalledWith({
      description: 'Nova Despesa',
      amount: 50,
      type: 'Despesa',
      category: 'Outros',
      date: '2026-03-28',
    });
    expect(component.isAddModalOpen()).toBe(false);
  });

  it('should call updateTransaction on submit when editing', () => {
    component.openEditModal(mockTransaction);
    const updatedValue = { ...mockTransaction, description: 'Teste Editado' };
    component.transactionForm.patchValue({ description: 'Teste Editado' });
    component.submitTransaction();
    expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith(updatedValue);
    expect(component.isAddModalOpen()).toBe(false);
  });

  it('should not submit an invalid form', () => {
    component.openAddModal();
    component.transactionForm.setValue({
      id: null,
      description: '',
      amount: null,
      type: 'Despesa',
      category: 'Outros',
      date: '2026-03-28',
    });
    component.submitTransaction();
    expect(mockTransactionService.addTransaction).not.toHaveBeenCalled();
    expect(mockTransactionService.updateTransaction).not.toHaveBeenCalled();
  });

  it('should call deleteTransaction with the correct id', () => {
    component.deleteTransaction('123');
    expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith('123');
  });
});
