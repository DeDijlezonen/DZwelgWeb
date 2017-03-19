import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNietGevondenComponent } from './pagina-niet-gevonden.component';

describe('PaginaNietGevondenComponent', () => {
  let component: PaginaNietGevondenComponent;
  let fixture: ComponentFixture<PaginaNietGevondenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaNietGevondenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNietGevondenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
