import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductieBewerkenComponent } from './productie-bewerken.component';

describe('ProductieBewerkenComponent', () => {
  let component: ProductieBewerkenComponent;
  let fixture: ComponentFixture<ProductieBewerkenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductieBewerkenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductieBewerkenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
