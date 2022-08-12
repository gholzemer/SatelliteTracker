import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionCategoryComponent } from './accordion-category.component';

describe('AccordionCategoryComponent', () => {
  let component: AccordionCategoryComponent;
  let fixture: ComponentFixture<AccordionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
