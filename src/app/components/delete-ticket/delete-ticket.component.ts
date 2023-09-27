import { Component, OnInit } from '@angular/core';
import { BodyTickets } from '../models/GetBodyTickets';
import { FormControl, FormGroup } from '@angular/forms';
import { TicketsService } from '../services/tickets.service';
import Swal from 'sweetalert2';
import { TicketService } from '../services/post-ticket.service';

@Component({
  selector: 'app-delete-ticket',
  templateUrl: './delete-ticket.component.html',
  styleUrls: ['./delete-ticket.component.scss']
})
export class DeleteTicketComponent implements OnInit{

  public agregarTicket: FormGroup = new FormGroup({
    consultarTick: new FormControl(null)
  });
  constructor(
    private _getTicket: TicketsService,
    private _deleteTicket: TicketService
  ){

  }
  ngOnInit(): void {

  }

  //Consultar lista de tickets
  consultarTickets() {
    const body: BodyTickets = {
      datos: [
        {
          id: "2",
          valor: this.agregarTicket.get('consultarTick')?.value.toString(),
          nombreFiltro: "ticket"
        }
      ]
    };
    this._getTicket.obtenerTicket(body).subscribe({
      next: (response) => {
        if (response.codigoRespuesta == "000") {
          if (response.datos == null) {
            console.log(response.descripcionRespuesta);

          } else {
            //console.log(JSON.stringify(response.datos))
            let ticket = response.datos;
            for (let idTicket of ticket){
              Swal.fire({
                title: 'Esta seguro de eliminar?',
                text: "eliminar el ticket "+`${idTicket.ticket}`+"?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.eliminarTicket(idTicket.id);
                }
              })
            }

          }
        } else if (response.codigoRespuesta == "001") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró ningún ticket!',
          })
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  eliminarTicket(id: number){
    this._deleteTicket.borrarTicket(id).subscribe({
      next:(value) => {
          if (value.codigoRespuesta=="000") {
            Swal.fire(
              'Eliminado!',
              'El Ticket ha sido eliminado',
              'success'
            )
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se encontró ningún ticket!',
            })
          }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


}
