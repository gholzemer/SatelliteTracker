import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCriteriaLayoutComponent } from './edit-criteria-layout.component';

describe('EditCriteriaLayoutComponent', () => {
  let component: EditCriteriaLayoutComponent;
  let fixture: ComponentFixture<EditCriteriaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCriteriaLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCriteriaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
