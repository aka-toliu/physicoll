import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollListComponent } from './coll-list.component';

describe('CollListComponent', () => {
  let component: CollListComponent;
  let fixture: ComponentFixture<CollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
