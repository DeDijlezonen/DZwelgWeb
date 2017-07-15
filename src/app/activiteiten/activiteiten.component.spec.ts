import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteitenComponent } from './activiteiten.component';

describe('ActiviteitenComponent', () => {
  let component: ActiviteitenComponent;
  let fixture: ComponentFixture<ActiviteitenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviteitenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteitenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
