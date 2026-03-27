import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CurrencyMaskDirective } from './currency-mask.directive';

@Component({
  template: `<input type="text" [formControl]="amount" appCurrencyMask />`,
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyMaskDirective],
})
class TestComponent {
  amount = new FormControl<number | null>(null);
}

describe('CurrencyMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });

  it('should format initial value on writeValue', () => {
    component.amount.setValue(1234.56);
    fixture.detectChanges();
    expect(inputEl.value).toContain('1.234,56');
  });

  it('should handle null value on writeValue', () => {
    component.amount.setValue(null);
    fixture.detectChanges();
    expect(inputEl.value).toBe('');
  });

  it('should unformat value on input and call onChange', () => {
    inputEl.value = 'R$ 5.432,10';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.amount.value).toBe(5432.1);
  });

  it('should handle empty input', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.amount.value).toBeNull();
  });

  it('should reformat the input value after user input', () => {
    inputEl.value = '12345';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toContain('123,45');
    expect(component.amount.value).toBe(123.45);
  });
});
