import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullyDetailCardsComponent } from './fully-detail-cards.component';

describe('FullyDetailCardsComponent', () => {
  let component: FullyDetailCardsComponent;
  let fixture: ComponentFixture<FullyDetailCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullyDetailCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullyDetailCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
