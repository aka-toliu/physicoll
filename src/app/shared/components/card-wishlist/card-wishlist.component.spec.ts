import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWishlistComponent } from './card-wishlist.component';

describe('CardWishlistComponent', () => {
  let component: CardWishlistComponent;
  let fixture: ComponentFixture<CardWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWishlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
