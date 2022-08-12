import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualUpdateLayoutComponent } from './manual-update-layout.component';

describe('ManualUpdateLayoutComponent', () => {
  let component: ManualUpdateLayoutComponent;
  let fixture: ComponentFixture<ManualUpdateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualUpdateLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualUpdateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
