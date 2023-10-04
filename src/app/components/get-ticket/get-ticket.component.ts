import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BodyTickets } from '../models/GetBodyTickets';
import { GetTickets } from '../models/TablaBodyTicket';
import { TicketsService } from '../services/tickets.service';
import { MatDialog } from '@angular/material/dialog';
import { GetGestionComponent } from '../gestion-tickets/get-gestion/get-gestion.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';




@Component({
  selector: 'app-get-ticket',
  templateUrl: './get-ticket.component.html',
  styleUrls: ['./get-ticket.component.scss']
})

export class GetTicketComponent implements OnInit {


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  //public Elementos_tabla: GetTickets[] = [];
  public displayedColumns: string[] = ['tipo', 'ticket', 'tema', 'descricion', 'solicitante', 'gerencia', 'fechaSol', 'responsable', 'caso', 'requerido', 'deLey', 'observaciones', 'icono']
  public dataSource: MatTableDataSource<GetTickets>;
  public datosTickets: Array<any> = [];
  public pagina: number = 0;
  public cantidad: number = 100;
  constructor(
    private _getTicket: TicketsService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.datosTickets);

  }
  ngOnInit(): void {
    this.listaTickets(this.pagina, this.cantidad);
  }

  // Método para cambiar de página
  onPageChange(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.listaTickets(this.pagina, this.cantidad);
  }

  listaTickets(pagina: number, cantidad: number) {
    const body: BodyTickets = {
      datos: []
    };
    this._getTicket.obtenerTicket(body, pagina, cantidad).subscribe({
      next: (response) => {
        if (response.codigoRespuesta == "000") {
          if (response.datos == null) {
            console.log(response.descripcionRespuesta);
          } else {
            this.dataSource.data = response.datos;
            this.dataSource.paginator = this.paginator;
          }
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modalGetGestionTicket(id: number, nombreTicket: string) {
    this.dialog.open(GetGestionComponent, {
      data: {
        id: id,
        nombreTicket: nombreTicket
      },
      enterAnimationDuration: 500
    })
  }

}

