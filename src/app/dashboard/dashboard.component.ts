import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TRANSACTION_CATEGORIES } from '../core/transaction.model';
import { TransactionService } from '../core/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public transactionService = inject(TransactionService);
  private fb = inject(FormBuilder);

  public categories = TRANSACTION_CATEGORIES;

  public transactionForm = this.fb.group({
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    type: ['Despesa' as const, Validators.required],
    category: [this.categories[0], Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
  });

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

  addTransaction(): void {
    if (this.transactionForm.valid && this.transactionForm.getRawValue()) {
      const formValue = this.transactionForm.getRawValue();
      this.transactionService.addTransaction({
        description: formValue.description!,
        amount: formValue.amount!,
        type: formValue.type!,
        category: formValue.category!,
        date: formValue.date!,
      });
      this.transactionForm.reset({
        description: '',
        amount: null,
        type: 'Despesa',
        category: this.categories[0],
        date: new Date().toISOString().substring(0, 10),
      });
    }
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
