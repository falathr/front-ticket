import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BodyTickets } from '../models/GetBodyTickets';
import { BodyDatosPost } from '../models/PostBody';
import { ConsultarCasoService } from '../services/consultar-caso.service';
import { ConsultarGerenciaService } from '../services/consultar-gerencia.service';
import { ConsultarTemasService } from '../services/consultar-temas.service';
import { ConsutlarPeronaResponsableService } from '../services/consutlar-perona-responsable.service';
import { ConsutlarPeronaSolicitanteService } from '../services/consutlar-perona-solicitante.service';
import { TicketService } from '../services/post-ticket.service';
import { TicketsService } from "../services/tickets.service";

@Component({
  selector: 'app-post-ticket',
  templateUrl: './post-ticket.component.html',
  styleUrls: ['./post-ticket.component.scss']
})
export class PostTicketComponent implements OnInit {

  public agregarTicket: FormGroup = new FormGroup({
    ticket: new FormControl(null, [Validators.required]),
    numeroCaso: new FormControl(null, [Validators.required]),
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
  });
  public listaGerencia: Array<any> =[];
  public listaCasos: Array<any> =[];
  public listaTemas: Array<any> = [];
  public listaTickets: Array<any> = [];
  public listaPersonaRes: Array<any> = [];
  public listaPersonaSol: Array<any> = [];
  constructor(
    private _postService: TicketService,
    private _dialogRef: MatDialogRef<PostTicketComponent>,
    private _gerenciaService: ConsultarGerenciaService,
    private _temaService: ConsultarTemasService,
    private _casoService: ConsultarCasoService,
    private _getTicket: TicketsService,
    private _personaResponsable: ConsutlarPeronaResponsableService,
    private _personaSolicitante: ConsutlarPeronaSolicitanteService

    ){}

  ngOnInit(): void {
    this.obtenerGerencia();
    this.obtenerCaso();
    this.obtenerTema();
    this.obtenerPerResponsable();
    this.obtenerPerSolicitante();
  }

  //Metodo que compara las fechas y deshabilita las fechas superiores al día actual
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

  postTicket(){
    const fechaDescString: string | null | undefined = this.agregarTicket.get('fechaSol')?.value; // Suponiendo que 'fecha' es una cadena en el formato 'YYYY-MM-DD'
    let fechaFormateada: any = 0;
    if (fechaDescString) {
      const fechaDesc: Date = new Date(fechaDescString);
      const dia = String(fechaDesc.getDate()).padStart(2, '0');
      const mes = String(fechaDesc.getMonth() + 1).padStart(2, '0');
      const anio = fechaDesc.getFullYear();

      fechaFormateada = `${dia}-${mes}-${anio}`;
    }
    let bodyTickets: BodyDatosPost = {
      tema: this.agregarTicket.get('tema')?.value,
      ticket: this.agregarTicket.get('ticket')?.value,
      tipo: this.agregarTicket.get('tipo')?.value,
      descripcion: this.agregarTicket.get('descripcion')?.value,
      solicitante: this.agregarTicket.get('solicitante')?.value,
      gerencia: this.agregarTicket.get('gerencia')?.value,
      fechaSol: fechaFormateada,
      responsable: this.agregarTicket.get('responsable')?.value,
      estadoTI: this.agregarTicket.get('estadoTI')?.value,
      requerido: this.agregarTicket.get('requerido')?.value,
      deLey: this.agregarTicket.get('deLey')?.value,
      observaciones: this.agregarTicket.get('observaciones')?.value,
      numeroCaso: this.agregarTicket.get('numeroCaso')?.value
    }
    this._postService.adicionarTicket(bodyTickets).subscribe({
      next:(value) =>{
          if (value.codigoRespuesta == "000") {
            Swal.fire('Guardado!', `${value.descripcion}` + ` del ticket # ${this.agregarTicket.get('ticket')?.value}`, 'success');
              this._dialogRef.close();

          }
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  obtenerGerencia(){
    this._gerenciaService.obtenerGerecias().subscribe({
      next:(result)=>{
        if (result.codigoRespuesta=="000") {
          this.listaGerencia = result.datos
        } else {
          Swal.fire('Error!', `${result.descripcion}`, 'error');
              this._dialogRef.close();
        }
      },
      error(err) {
        console.info("Error: "+err)
      },
    })
  }

  obtenerCaso(){
    this._casoService.obtenerCasos().subscribe({
      next:(result) => {
        if (result.codigoRespuesta="000") {
          this.listaCasos = result.datos
        } else {
          Swal.fire('Error!', `${result.descripcion}`, 'error');
              this._dialogRef.close();
        }
      },
      error(err) {
        console.info("Error: "+err)
      },
    })
  }

  obtenerTema(){
    this._temaService.obtenerTemas().subscribe({
      next:(result) => {
          if (result.codigoRespuesta=="000") {
            this.listaTemas = result.datos;
          } else {
            Swal.fire('Error!', `${result.descripcion}`, 'error');
              this._dialogRef.close();
          }
      },
      error(err) {
        console.info("Error: "+err)
      },
    })
  }

  obtenerPerResponsable(){
    this._personaResponsable.obtenerPersonaResponsable().subscribe({
      next:(result) => {
          if (result.codigoRespuesta=="000") {
            this.listaPersonaRes = result.datos;
          } else {
            Swal.fire('Error!', `${result.descripcion}`, 'error');
              this._dialogRef.close();
          }
      },
      error(err) {
        console.info("Error: "+err)
      },
    })
  }

  obtenerPerSolicitante(){
    this._personaSolicitante.obtenerPersonaSolicitante().subscribe({
      next:(result) => {
          if (result.codigoRespuesta=="000") {
            this.listaPersonaSol = result.datos;
          } else {
            Swal.fire('Error!', `${result.descripcion}`, 'error');
              this._dialogRef.close();
          }
      },
      error(err) {
        console.info("Error: "+err)
      },
    })
  }

  //Consultar lista de tickets
  consultarTickets() {
    const body: BodyTickets = {
      datos: [
        {
          id: "2",
          valor: this.agregarTicket.get('ticket')?.value.toString(),
          nombreFiltro: "ticket"
        }
      ]
    };
    this._getTicket.obtenerTicket(body,0,1).subscribe({
      next: (response) => {
        if (response.codigoRespuesta == "000") {
          Swal.fire({
            icon: 'warning',
            title: 'Ya existe el ticket ' + `${this.agregarTicket.get('ticket')?.value}`,
            text: 'Por favor validar e intente de nuevo',
            didClose: () => { document.getElementById('ticket')?.focus(); }
          })
          this.limpiarCampo();

        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  limpiarCampo(){
    this.agregarTicket.patchValue({
      ticket: ""
    });
  }
}
