import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductComponent ],
      imports: [ FormsModule ] // Import module để sử dụng ngModel
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display greeting message when username is provided', () => {
    component.username = 'Test User';
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.greeting-container'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Xin chào Test User');
  });

  it('should call logout method when logout button is clicked', () => {
    spyOn(component, 'logout');
    de = fixture.debugElement.query(By.css('.logout-button'));
    el = de.nativeElement;
    el.click();
    expect(component.logout).toHaveBeenCalled();
  });

  it('should bind product name to input field', () => {
    component.product.name = 'Sản phẩm A';
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#product-name'));
    const inputElement = de.nativeElement as HTMLInputElement; // Đổi kiểu thành HTMLInputElement
    expect(inputElement.value).toBe('Sản phẩm A');
  });
  
  it('should update product description when content is edited', () => {
    component.product.description = 'Mô tả sản phẩm';
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.editor-content'));
    const editorElement = de.nativeElement as HTMLDivElement; // Đảm bảo kiểu là HTMLDivElement
    editorElement.innerHTML = 'Mô tả sản phẩm mới';
    editorElement.dispatchEvent(new Event('input'));
    expect(component.product.description).toBe('Mô tả sản phẩm mới');
  });
  

  it('should handle image selection', () => {
    spyOn(component, 'onImageSelect');
    const inputFile = fixture.debugElement.query(By.css('#product-image')).nativeElement;
    const fileEvent = {
      target: {
        files: [new File([''], 'test-image.png', { type: 'image/png' })]
      }
    };
    inputFile.dispatchEvent(new Event('change'));
    component.onImageSelect(fileEvent);
    expect(component.onImageSelect).toHaveBeenCalled();
    expect(component.product.image).toBeTruthy();
  });

  it('should call addProduct method when the submit button is clicked', () => {
    spyOn(component, 'addProduct');
    const submitButton = fixture.debugElement.query(By.css('.btn-submit')).nativeElement;
    submitButton.click();
    expect(component.addProduct).toHaveBeenCalled();
  });

  it('should update product description when content is edited', () => {
    component.product.description = 'Mô tả sản phẩm';
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.editor-content'));
    el = de.nativeElement;
    el.innerHTML = 'Mô tả sản phẩm mới';
    el.dispatchEvent(new Event('input'));
    expect(component.product.description).toBe('Mô tả sản phẩm mới');
  });
});
