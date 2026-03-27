import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  TRANSACTION_CATEGORIES,
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../core/transaction.model';
import { TransactionService } from '../core/transaction.service';
import { CurrencyMaskDirective } from '../shared/currency-mask.directive';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective,
    ModalComponent,
    CurrencyMaskDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public transactionService = inject(TransactionService);
  private fb = inject(FormBuilder);

  public categories = TRANSACTION_CATEGORIES;

  public transactionForm = this.fb.group({
    id: [null as string | null],
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    type: ['Despesa' as TransactionType, Validators.required],
    category: [this.categories[0] as TransactionCategory, Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
  });

  public isAddModalOpen = signal(false);
  public editingTransaction = signal<Transaction | null>(null);

  public sortedTransactions = computed(() =>
    this.transactionService
      .transactions()
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  );

  public doughnutChartData = computed((): ChartConfiguration<'doughnut'>['data'] => {
    const expensesData = this.transactionService.expensesByCategory();
    return {
      labels: Object.keys(expensesData),
      datasets: [
        {
          data: Object.values(expensesData),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#C9CBCF',
            '#7C4DFF',
          ],
          borderColor: '#1F2937',
          borderWidth: 2,
          hoverBorderColor: '#374151',
        },
      ],
    };
  });

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#D1D5DB',
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
    },
    cutout: '60%',
  };

  openAddModal(): void {
    this.transactionForm.reset({
      id: null,
      description: '',
      amount: 0,
      type: 'Despesa',
      category: this.categories[0],
      date: new Date().toISOString().substring(0, 10),
    });
    this.editingTransaction.set(null);
    this.isAddModalOpen.set(true);
  }

  openEditModal(transaction: Transaction): void {
    this.transactionForm.patchValue(transaction);
    this.editingTransaction.set(transaction);
    this.isAddModalOpen.set(true);
  }

  closeModal(): void {
    this.isAddModalOpen.set(false);
    this.editingTransaction.set(null);
  }

  submitTransaction(): void {
    if (this.transactionForm.invalid) {
      return;
    }
    const formValue = this.transactionForm.getRawValue();

    if (this.editingTransaction()) {
      this.transactionService.updateTransaction({
        id: this.editingTransaction()!.id,
        description: formValue.description!,
        amount: formValue.amount!,
        type: formValue.type!,
        category: formValue.category!,
        date: formValue.date!,
      });
    } else {
      this.transactionService.addTransaction({
        description: formValue.description!,
        amount: formValue.amount!,
        type: formValue.type!,
        category: formValue.category!,
        date: formValue.date!,
      });
    }

    this.closeModal();
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
