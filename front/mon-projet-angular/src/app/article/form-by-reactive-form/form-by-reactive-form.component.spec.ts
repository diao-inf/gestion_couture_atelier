import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormByReactiveFormComponent } from './form-by-reactive-form.component';

describe('FormByReactiveFormComponent', () => {
  let component: FormByReactiveFormComponent;
  let fixture: ComponentFixture<FormByReactiveFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormByReactiveFormComponent]
    });
    fixture = TestBed.createComponent(FormByReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
