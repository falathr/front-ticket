import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutTicketComponent } from './put-ticket.component';

describe('PutTicketComponent', () => {
  let component: PutTicketComponent;
  let fixture: ComponentFixture<PutTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PutTicketComponent]
    });
    fixture = TestBed.createComponent(PutTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
