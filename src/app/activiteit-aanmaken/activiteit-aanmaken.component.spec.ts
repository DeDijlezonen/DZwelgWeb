import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteitAanmakenComponent } from './activiteit-aanmaken.component';

describe('ActiviteitAanmakenComponent', () => {
  let component: ActiviteitAanmakenComponent;
  let fixture: ComponentFixture<ActiviteitAanmakenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteitAanmakenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteitAanmakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
