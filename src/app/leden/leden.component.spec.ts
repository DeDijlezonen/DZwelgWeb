import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedenComponent } from './leden.component';

describe('LedenComponent', () => {
  let component: LedenComponent;
  let fixture: ComponentFixture<LedenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
