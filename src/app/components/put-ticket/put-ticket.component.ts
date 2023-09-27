import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultarGerenciaService } from '../services/consultar-gerencia.service';
import { ConsultarTemasService } from '../services/consultar-temas.service';
import { ConsultarCasoService } from '../services/consultar-caso.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { BodyTickets } from '../models/GetBodyTickets';
import { TicketsService } from '../services/tickets.service';
import { TicketService } from '../services/post-ticket.service';
import { BodyDatosPost } from '../models/PostBody';
import { MatTableDataSource } from '@angular/material/table';
import { GetTickets } from '../models/TablaBodyTicket';

@Component({
  selector: 'app-put-ticket',
  templateUrl: './put-ticket.component.html',
  styleUrls: ['./put-ticket.component.scss']
})
export class PutTicketComponent implements OnInit {

  public agregarTicket: FormGroup = new FormGroup({
    ticket: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    tema: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required]),
    solicitante: new FormControl(null, [Validators.required]),
    gerencia: new FormControl(null, [Validators.required]),
    fechaSol: new FormControl(null, [Validators.required]),
    responsable: new FormControl(null, [Validators.required]),
    estadoTI: new FormControl(null, [Validators.required]),
    requerido: new FormControl(null, [Validators.required]),
    deLey: new FormControl(null, [Validators.required]),
    observaciones: new FormControl(null, [Validators.required]),
    consultarTick: new FormControl(null)
  });

  public idTicket:number = 0;
  public listaGerencia: Array<any> = [];
  public listaCasos: Array<any> = [];
  public listaTemas: Array<any> = [];
  public listaTickets: Array<any> = [];
  public dataSource: MatTableDataSource<GetTickets>;

  constructor(
    private _dialogRef: MatDialogRef<PutTicketComponent>,
    private _gerenciaService: ConsultarGerenciaService,
    private _temaService: ConsultarTemasService,
    private _casoService: ConsultarCasoService,
    private _getTicket: TicketsService,
    private _putTicket: TicketService

  ) {
    this.dataSource = new MatTableDataSource()
  }

  ngOnInit(): void {
    //this.consultarTickets();
    this.obtenerGerencia();
    this.obtenerCaso();
    this.obtenerTema();
    this.activarCampos();
  }

  obtenerGerencia() {
    this._gerenciaService.obtenerGerecias().subscribe({
      next: (result) => {
        if (result.codigoRespuesta == "000") {
          this.listaGerencia = result.datos
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

  obtenerTema() {
    this._temaService.obtenerTemas().subscribe({
      next: (result) => {
        if (result.codigoRespuesta == "000") {
          this.listaTemas = result.datos;
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

  //Metodo que compara las fechas y deshabilita las fechas superiores al día actual
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

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
            this.listaTickets = response.datos;
            console.log(JSON.stringify(this.listaTickets));
            this.cargarDatos();
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  //Activa o desbloquea los campos del formualrio
  activarCampos() {
    if (this.agregarTicket.get('ticket')?.value == null || this.agregarTicket.get('ticket')?.value == "") {
      this.agregarTicket.disable();
      this.agregarTicket.get('consultarTick')?.enable();
    } else {
      this.agregarTicket.enable();
    }
  }

  //cargar los datos despues de seleccionar el ticket
  cargarDatos() {
    for(let tick of this.listaTickets){


    this.agregarTicket.patchValue({
      ticket: tick.ticket,
      tipo: tick.tipo.toString(),
      tema: tick.tema.toString(),
      descripcion: tick.descricion,
      solicitante: tick.solicitante,
      gerencia: tick.gerencia.toString(),
      fechaSol: tick.fechaSol,
      responsable: tick.responsable,
      estadoTI: tick.caso.toString(),
      requerido: tick.requerido.toString(),
      deLey: tick.deLey.toString(),
      observaciones: tick.observaciones
    });
    this.idTicket= tick.id
    }
    this.activarCampos();
  }

  actualizarTicket() {
    let bodyTickets: BodyDatosPost = {
      tema: this.agregarTicket.get('tema')?.value,
      ticket: this.agregarTicket.get('ticket')?.value,
      tipo: this.agregarTicket.get('tipo')?.value,
      descripcion: this.agregarTicket.get('descripcion')?.value,
      solicitante: this.agregarTicket.get('solicitante')?.value,
      gerencia: this.agregarTicket.get('gerencia')?.value,
      fechaSol: this.agregarTicket.get('fechaSol')?.value,
      responsable: this.agregarTicket.get('responsable')?.value,
      estadoTI: this.agregarTicket.get('estadoTI')?.value,
      requerido: this.agregarTicket.get('requerido')?.value,
      deLey: this.agregarTicket.get('deLey')?.value,
      observaciones: this.agregarTicket.get('observaciones')?.value,
    }
    this._putTicket.actualizarTicket(this.idTicket, bodyTickets).subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          Swal.fire('Guardado!', `${value.descripcion}`, 'success');
          this._dialogRef.close();
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
