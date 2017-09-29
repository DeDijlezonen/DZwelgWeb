import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNietToegelatenComponent } from './pagina-niet-toegelaten.component';

describe('PaginaNietToegelatenComponent', () => {
  let component: PaginaNietToegelatenComponent;
  let fixture: ComponentFixture<PaginaNietToegelatenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaNietToegelatenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNietToegelatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
