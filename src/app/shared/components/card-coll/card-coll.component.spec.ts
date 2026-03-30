import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCollComponent } from './card-coll.component';

describe('CardCollComponent', () => {
  let component: CardCollComponent;
  let fixture: ComponentFixture<CardCollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
