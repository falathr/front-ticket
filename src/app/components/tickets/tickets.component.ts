import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetTicketComponent } from '../get-ticket/get-ticket.component';
import { PostTicketComponent } from '../post-ticket/post-ticket.component';
import { PutTicketComponent } from '../put-ticket/put-ticket.component';
import { DeleteTicketComponent } from '../delete-ticket/delete-ticket.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  modalGetTicket() {
    this.dialog.open(GetTicketComponent, {
      minWidth: '50px',
      enterAnimationDuration: 500
    })
  }

  //llama ventana agregar ticket
  agregarTicket() {
    this.dialog.open(PostTicketComponent, {
      minWidth: '500px',
      disableClose: true,
      enterAnimationDuration: 500
    });
  }

  //llama ventana actualizar ticket
  actualizarTicket() {
    this.dialog.open(PutTicketComponent, {
      minWidth: '600px',
      disableClose: true,
      enterAnimationDuration: 500
    });
  }

  modalDeleteTicket() {
    this.dialog.open(DeleteTicketComponent, {
      minWidth: '100px',
      enterAnimationDuration: 500
    })
  }
}
