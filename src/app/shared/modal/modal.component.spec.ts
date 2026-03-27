import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modalDiv = fixture.debugElement.query(By.css('.fixed'));
    expect(modalDiv).toBeFalsy();
  });

  it('should render when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modalDiv = fixture.debugElement.query(By.css('.fixed'));
    expect(modalDiv).toBeTruthy();
  });

  it('should display the correct title', () => {
    component.isOpen = true;
    component.title = 'Test Title';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleEl.textContent).toBe('Test Title');
  });

  it('should emit modalClose when the close button is clicked', () => {
    vi.spyOn(component.modalClose, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const closeButton = fixture.debugElement.query(By.css('button')).nativeElement;
    closeButton.click();
    expect(component.modalClose.emit).toHaveBeenCalled();
  });

  it('should emit modalClose when the overlay is clicked', () => {
    vi.spyOn(component.modalClose, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const overlayDiv = fixture.debugElement.query(By.css('.fixed')).nativeElement;
    overlayDiv.click();
    expect(component.modalClose.emit).toHaveBeenCalled();
  });

  it('should not emit modalClose when the modal content is clicked', () => {
    vi.spyOn(component.modalClose, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const modalContentDiv = fixture.debugElement.query(By.css('.relative')).nativeElement;
    modalContentDiv.click();
    expect(component.modalClose.emit).not.toHaveBeenCalled();
  });
});
