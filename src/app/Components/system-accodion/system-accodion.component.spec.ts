import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAccodionComponent } from './system-accodion.component';

describe('SystemAccodionComponent', () => {
  let component: SystemAccodionComponent;
  let fixture: ComponentFixture<SystemAccodionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAccodionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemAccodionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
