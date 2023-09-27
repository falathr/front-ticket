import {  Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { TicketService } from '../services/post-ticket.service';
import { BodyTickets } from '../models/GetBodyTickets';
import { BodyDatosPost } from '../models/PostBody';
import Swal from 'sweetalert2';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ConsultarGerenciaService } from '../services/consultar-gerencia.service';
import { ConsultarTemasService } from '../services/consultar-temas.service';
import { ConsultarCasoService } from '../services/consultar-caso.service';

@Component({
  selector: 'app-post-ticket',
  templateUrl: './post-ticket.component.html',
  styleUrls: ['./post-ticket.component.scss']
})
export class PostTicketComponent implements OnInit {

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
  });
  public listaGerencia: Array<any> =[];
  public listaCasos: Array<any> =[];
  public listaTemas: Array<any> = [];
  constructor(
    private _postService: TicketService,
    private _dialogRef: MatDialogRef<PostTicketComponent>,
    private _gerenciaService: ConsultarGerenciaService,
    private _temaService: ConsultarTemasService,
    private _casoService: ConsultarCasoService
    ){}

  ngOnInit(): void {
    this.obtenerGerencia();
    this.obtenerCaso();
    this.obtenerTema();
  }

  //Metodo que compara las fechas y deshabilita las fechas superiores al día actual
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

  postTicket(){
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
    this._postService.adicionarTicket(bodyTickets).subscribe({
      next:(value) =>{
          if (value.codigoRespuesta == "000") {
            Swal.fire('Guardado!', `${value.descripcion}`, 'success');
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
}
