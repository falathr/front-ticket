import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTicketComponent } from './post-ticket.component';

describe('PostTicketComponent', () => {
  let component: PostTicketComponent;
  let fixture: ComponentFixture<PostTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostTicketComponent]
    });
    fixture = TestBed.createComponent(PostTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
