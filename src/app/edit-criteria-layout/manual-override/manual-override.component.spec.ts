import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualOverrideComponent } from './manual-override.component';

describe('ManualOverrideComponent', () => {
  let component: ManualOverrideComponent;
  let fixture: ComponentFixture<ManualOverrideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualOverrideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
