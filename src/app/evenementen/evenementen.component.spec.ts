import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementenComponent } from './evenementen.component';

describe('EvenementenComponent', () => {
  let component: EvenementenComponent;
  let fixture: ComponentFixture<EvenementenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvenementenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvenementenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
