import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConsultarResponsableService } from '../../services/consultar-responsable.service';
import Swal from 'sweetalert2';
import { BodyDatosPostGestion } from '../../models/PostBody';
import { GestionTicketService } from '../../services/gestion-ticket.service';
import { GetGestionComponent } from '../get-gestion/get-gestion.component';
import { ConsutlarPeronaResponsableService } from '../../services/consutlar-perona-responsable.service';

@Component({
  selector: 'app-put-gestion',
  templateUrl: './put-gestion.component.html',
  styleUrls: ['./put-gestion.component.scss']
})
export class PutGestionComponent implements OnInit {

  public capturarDatos: any = '';
  public editarGestionForm: FormGroup = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    fecha: new FormControl(null, [Validators.required]),
    responsable: new FormControl(null, [Validators.required])
  })
  public listaResponsables: Array<any> = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _listaResponsable: ConsutlarPeronaResponsableService,
    private dialogRef: MatDialogRef<PutGestionComponent>,
    private dialog: MatDialog,
    private _gestionTicket: GestionTicketService
  ) {
    this.capturarDatos = data;
  }
  ngOnInit(): void {
    this.consultarResponsable();
    this.cargarDatos();
  }

  //Metodo que compara las fechas y deshabilita las fechas superiores al día actual
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

  consultarResponsable() {
    this._listaResponsable.obtenerPersonaResponsable().subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          this.listaResponsables = value.datos
        } else if (value.codigoRespuesta == "001") {
          Swal.fire({
            icon: 'error',
            title: `${value.descripcion},` + ` del ticket ${this.capturarDatos.nombreTicket}`,
            showConfirmButton: false,
            timer: 2000
          })
          this.dialogRef.close()
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: `${error}`,
          showConfirmButton: false,
          timer: 2000
        })
        this.dialogRef.close()
      }
    })
  }

  cargarDatos() {
    let fechaOriginal = new Date(this.capturarDatos.fecha); // Convierte la cadena a un objeto de fecha
    let fechaSumada = new Date(fechaOriginal.getTime()); // Crea una copia para no modificar la original

    fechaSumada.setDate(fechaOriginal.getDate() + 1); // Suma un día
    this.editarGestionForm.patchValue({
      descripcion: this.capturarDatos.desc,
      fecha: fechaSumada,
      responsable: this.capturarDatos.responsable.toString()
    })
  }

  actualizarDatos() {
    const fechaDescString: string | null | undefined = this.editarGestionForm.get('fecha')?.value; // Suponiendo que 'fecha' es una cadena en el formato 'YYYY-MM-DD'
    let fechaFormateada: any = 0;
    if (fechaDescString) {
      const fechaDesc: Date = new Date(fechaDescString);
      const dia = String(fechaDesc.getDate()).padStart(2, '0');
      const mes = String(fechaDesc.getMonth() + 1).padStart(2, '0');
      const anio = fechaDesc.getFullYear();

      fechaFormateada = `${dia}-${mes}-${anio}`;
    }
    let body: BodyDatosPostGestion = {
      fechaDesc: fechaFormateada,
      responsable: this.editarGestionForm.get('responsable')?.value,
      ticket: this.capturarDatos.id.toString(),
      desc: this.editarGestionForm.get('descripcion')?.value,
    }
    this._gestionTicket.actualizarGestion(this.capturarDatos.elementId, body).subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          Swal.fire('Actualizado!', `${value.descripcion}`, 'success');
          this.dialogRef.close();
        }
        if (value.codigoRespuesta == "001") {
          Swal.fire({
            icon: 'error',
            title: `${value.descripcion},` + ` del ticket ${this.capturarDatos.nombreTicket}`,
            showConfirmButton: false,
            timer: 2000
          })
          this.dialogRef.close()
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: `${error}`,
          showConfirmButton: false,
          timer: 2000
        })
        this.dialogRef.close()
      }
    })
    this.modalPostGestionTicket();
  }

  modalPostGestionTicket() {
    this.dialog.open(GetGestionComponent, {
      data: {
        id: this.capturarDatos.id,
        nombreTicket: this.capturarDatos.nombreTicket
      },
      enterAnimationDuration: 500
    })
    this.dialogRef.close()
  }


}
