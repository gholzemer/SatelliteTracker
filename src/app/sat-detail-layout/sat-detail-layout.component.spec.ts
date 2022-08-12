import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatDetailLayoutComponent } from './sat-detail-layout.component';

describe('SatDetailLayoutComponent', () => {
  let component: SatDetailLayoutComponent;
  let fixture: ComponentFixture<SatDetailLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatDetailLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatDetailLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
