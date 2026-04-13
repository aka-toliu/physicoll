import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollFormComponent } from './coll-form.component';

describe('CollFormComponent', () => {
  let component: CollFormComponent;
  let fixture: ComponentFixture<CollFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
