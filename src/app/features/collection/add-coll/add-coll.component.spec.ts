import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollComponent } from './add-coll.component';

describe('AddCollComponent', () => {
  let component: AddCollComponent;
  let fixture: ComponentFixture<AddCollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
