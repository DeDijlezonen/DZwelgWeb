import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBeheerComponent } from './stock-beheer.component';

describe('StockBeheerComponent', () => {
  let component: StockBeheerComponent;
  let fixture: ComponentFixture<StockBeheerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBeheerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBeheerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
