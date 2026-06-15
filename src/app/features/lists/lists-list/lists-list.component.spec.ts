import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsListComponent } from './lists-list.component';

describe('ListsListComponent', () => {
  let component: ListsListComponent;
  let fixture: ComponentFixture<ListsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
