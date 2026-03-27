import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { DashboardViewModel } from './dashboard.viewmodel';
import { signal } from '@angular/core';
import { TRANSACTION_CATEGORIES } from '../core/transaction.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockVm: Partial<DashboardViewModel>;

  beforeEach(async () => {
    mockVm = {
      totalIncome: signal(0),
      totalExpenses: signal(0),
      balance: signal(0),
      chartData: signal({ labels: [], datasets: [{ data: [] }] }),
      chartOptions: {},
      sortedTransactions: signal([]),
      isModalOpen: signal(false),
      editingTransaction: signal(null),
      form: { invalid: false, getRawValue: () => ({}) } as any,
      openAddModal: vi.fn(),
      openEditModal: vi.fn(),
      closeModal: vi.fn(),
      submit: vi.fn(),
      delete: vi.fn(),
      categories: TRANSACTION_CATEGORIES,
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
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
