import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollDetailsComponent } from './coll-details.component';

describe('CollDetailsComponent', () => {
  let component: CollDetailsComponent;
  let fixture: ComponentFixture<CollDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
