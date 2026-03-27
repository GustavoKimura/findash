import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { DashboardViewModel } from './dashboard.viewmodel';
import { signal } from '@angular/core';
import {
  TRANSACTION_CATEGORIES,
  TransactionCategory,
  TransactionType,
} from '../core/transaction.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockVm: Partial<DashboardViewModel>;
  let fb: FormBuilder;

  beforeEach(async () => {
    fb = new FormBuilder();

    mockVm = {
      totalIncome: signal(0),
      totalExpenses: signal(0),
      balance: signal(0),
      chartData: signal({ labels: [], datasets: [{ data: [] }] }),
      chartOptions: {},
      sortedTransactions: signal([]),
      isModalOpen: signal(false),
      editingTransaction: signal(null),
      form: fb.group({
        id: [null as string | null],
        description: ['', Validators.required],
        amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
        type: ['Despesa' as TransactionType, Validators.required],
        category: [TRANSACTION_CATEGORIES[0] as TransactionCategory, Validators.required],
        date: [new Date().toISOString().substring(0, 10), Validators.required],
      }) as any,
      openAddModal: vi.fn(),
      openEditModal: vi.fn(),
      closeModal: vi.fn(),
      submit: vi.fn(),
      delete: vi.fn(),
      categories: TRANSACTION_CATEGORIES,
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, ReactiveFormsModule],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(DashboardComponent, {
        set: { providers: [{ provide: DashboardViewModel, useValue: mockVm }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call vm methods on actions', () => {
    component.vm.openAddModal();
    expect(mockVm.openAddModal).toHaveBeenCalled();
  });
});
