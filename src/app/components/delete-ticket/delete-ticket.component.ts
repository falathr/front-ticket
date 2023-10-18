import { Component, OnInit } from '@angular/core';
import { BodyTickets } from '../models/GetBodyTickets'; // Importación de modelo para cuerpo de tickets
import { FormControl, FormGroup } from '@angular/forms'; // Importación de FormControl y FormGroup desde Angular forms
import { TicketsService } from '../services/tickets.service'; // Importación de servicio para obtener tickets
import Swal from 'sweetalert2'; // Importación de librería de alertas
import { TicketService } from '../services/post-ticket.service'; // Importación de servicio para eliminar tickets

@Component({
  selector: 'app-delete-ticket',
  templateUrl: './delete-ticket.component.html',
  styleUrls: ['./delete-ticket.component.scss']
})
export class DeleteTicketComponent implements OnInit {

  public agregarTicket: FormGroup = new FormGroup({
    consultarTick: new FormControl(null) // Definición de formulario con un campo para consultar ticket
  });

  constructor(
    private _getTicket: TicketsService, // Inyección de servicio para obtener tickets
    private _deleteTicket: TicketService // Inyección de servicio para eliminar tickets
  ) { }

  ngOnInit(): void {
    // Lógica que se ejecuta al inicializar el componente
  }

  // Método para consultar lista de tickets
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
    this._getTicket.obtenerTicket(body, 0, 1).subscribe({
      next: (response) => {
        if (response.codigoRespuesta == "000") {
          if (response.datos == null) {
            console.log(response.descripcionRespuesta);
          } else {
            let ticket = response.datos;
            for (let idTicket of ticket) {
              // Alerta de confirmación para eliminar ticket
              Swal.fire({
                title: 'Esta seguro de eliminar?',
                text: "eliminar el ticket " + `${idTicket.ticket}` + "?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.eliminarTicket(idTicket.id); // Llama a la función de eliminación si el usuario confirma
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

  // Método para eliminar ticket
  eliminarTicket(id: number) {
    this._deleteTicket.borrarTicket(id).subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
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
