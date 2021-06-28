import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosProgamadosFechaComponent } from './eventos-progamados-fecha.component';

describe('EventosProgamadosFechaComponent', () => {
  let component: EventosProgamadosFechaComponent;
  let fixture: ComponentFixture<EventosProgamadosFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventosProgamadosFechaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosProgamadosFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
