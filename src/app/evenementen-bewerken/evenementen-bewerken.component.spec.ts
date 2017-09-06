import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementenBewerkenComponent } from './evenementen-bewerken.component';

describe('EvenementenBewerkenComponent', () => {
  let component: EvenementenBewerkenComponent;
  let fixture: ComponentFixture<EvenementenBewerkenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvenementenBewerkenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvenementenBewerkenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
