import { Component, OnInit, ViewChild } from '@angular/core';
import { GetTickets } from '../models/TablaBodyTicket';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsutlarPeronaResponsableService } from '../services/consutlar-perona-responsable.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { ConsultarCasoService } from '../services/consultar-caso.service';
import { BodyTickets } from '../models/GetBodyTickets';
import { TicketsService } from '../services/tickets.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  public displayedColumns: string[] = ['tipo', 'ticket', 'tema', 'descricion', 'solicitante', 'gerencia', 'fechaSol', 'responsable', 'caso', 'requerido', 'deLey', 'observaciones']
  public dataSource: MatTableDataSource<GetTickets>;
  public listaPersonaRes: Array<any> = [];
  public listaCasos: Array<any> = [];
  public datosTickets: Array<any> = [];
  public pagina: number = 0;
  public cantidad: number = 100;
  public agregarTicketform: FormGroup = new FormGroup({
    estado: new FormControl(null, [Validators.required]),
    responsable: new FormControl(null, [Validators.required])
  })
  constructor(
    private _getTicket: TicketsService,
    private _personaResponsable: ConsutlarPeronaResponsableService,
    private _dialogRef: MatDialogRef<ReportesComponent>,
    private _casoService: ConsultarCasoService,
  ) {
    this.dataSource = new MatTableDataSource(this.datosTickets);
  }

  ngOnInit(): void {
    this.obtenerPerResponsable();
    this.obtenerCaso();
  }

  // Método para cambiar de página
  onPageChange(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.listarTicket(this.pagina, this.cantidad);
  }

  obtenerPerResponsable() {
    this._personaResponsable.obtenerPersonaResponsable().subscribe({
      next: (result) => {
        if (result.codigoRespuesta == "000") {
          this.listaPersonaRes = result.datos;
        } else {
          Swal.fire('Error!', `${result.descripcion}`, 'error');
          this._dialogRef.close();
        }
      },
      error(err) {
        console.info("Error: " + err)
      },
    })
  }

  obtenerCaso() {
    this._casoService.obtenerCasos().subscribe({
      next: (result) => {
        if (result.codigoRespuesta = "000") {
          this.listaCasos = result.datos
        } else {
          Swal.fire('Error!', `${result.descripcion}`, 'error');
          this._dialogRef.close();
        }
      },
      error(err) {
        console.info("Error: " + err)
      },
    })
  }

  listarTicket(pagina: number, cantidad: number) {
    let body: BodyTickets = {
      datos: [{
        id: "8",
        valor: this.agregarTicketform.get('responsable')?.value,
        nombreFiltro: "responsable"
      },{
        id: "9",
        valor: this.agregarTicketform.get('estado')?.value,
        nombreFiltro: "estadoTI"
      }]
    };
    this._getTicket.obtenerTicket(body, pagina, cantidad).subscribe({
      next:(value) =>{
          if (value.codigoRespuesta == "000") {
            this.dataSource.data = value.datos;
            this.dataSource.paginator = this.paginator;
            this.agregarTicketform.reset();
          } else
          if (value.codigoRespuesta == "001") {
            Swal.fire({
              icon: 'warning',
              title: 'No hay datos',
              text: 'Por favor validar e intente de nuevo',
            })
          }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  exportToExcel() {
    const element = document.getElementById('table'); // ID de la tabla
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1'); // nombre de la hoja

    // Guardar el archivo
    XLSX.writeFile(wb, 'reporte_ticket.xlsx'); // Nombre del archivo
    this.agregarTicketform.reset();
    this.dataSource = new MatTableDataSource<any>([]);
    this.paginator.firstPage();
  }

}
