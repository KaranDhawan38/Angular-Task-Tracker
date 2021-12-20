import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateBackButtonComponent } from './navigate-back-button.component';

describe('NavigateBackButtonComponent', () => {
  let component: NavigateBackButtonComponent;
  let fixture: ComponentFixture<NavigateBackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigateBackButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigateBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
