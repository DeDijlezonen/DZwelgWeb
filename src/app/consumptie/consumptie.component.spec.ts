import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptieComponent } from './consumptie.component';

describe('ConsumptieComponent', () => {
  let component: ConsumptieComponent;
  let fixture: ComponentFixture<ConsumptieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
