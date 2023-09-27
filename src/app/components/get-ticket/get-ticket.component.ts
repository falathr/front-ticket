import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BodyTickets } from '../models/GetBodyTickets';
import { GetTickets } from '../models/TablaBodyTicket';
import { TicketsService } from '../services/tickets.service';



@Component({
  selector: 'app-get-ticket',
  templateUrl: './get-ticket.component.html',
  styleUrls: ['./get-ticket.component.scss']
})

export class GetTicketComponent implements OnInit {

  @ViewChild(MatTable) table!: MatTable<any>;
  //public Elementos_tabla: GetTickets[] = [];
  public displayedColumns: string [] = ['tipo', 'ticket', 'tema', 'descricion', 'solicitante', 'gerencia', 'fechaSol', 'responsable', 'caso', 'requerido', 'deLey', 'observaciones']
  public dataSource: MatTableDataSource<GetTickets>;
  public datosTickets: Array<any> = [];
  constructor(
    private _getTicket: TicketsService
  ){
    this.dataSource = new MatTableDataSource(this.datosTickets)
  }
  ngOnInit(): void{
    this.listaTickets();
  }

  listaTickets(){
    const body: BodyTickets = {
      datos: []
    };
    this._getTicket.obtenerTicket(body).subscribe({
      next:(response) => {
          if (response.codigoRespuesta == "000"){
            if (response.datos == null) {
              console.log(response.descripcionRespuesta);
            } else{
              this.dataSource.data = response.datos;
            }
          }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

