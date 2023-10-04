import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BodyDatosPostGestion } from '../../models/PostBody';
import { ConsultarResponsableService } from '../../services/consultar-responsable.service';
import { GestionTicketService } from '../../services/gestion-ticket.service';
import { GetGestionComponent } from '../get-gestion/get-gestion.component';

@Component({
  selector: 'app-post-gestion',
  templateUrl: './post-gestion.component.html',
  styleUrls: ['./post-gestion.component.scss']
})
export class PostGestionComponent implements OnInit {

  public listaResponsables: Array<any> = [];
  isLinear = false;
  firstFormGroup = this._formBuilder.group({
    descripcion: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    fecha: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    responsable: ['', Validators.required],
  });
  public capturarDatos: any = '';
  constructor(
    private _listaResponsable: ConsultarResponsableService,
    private _formBuilder: FormBuilder,
    private _gestionTicket: GestionTicketService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PostGestionComponent>,
    private dialog: MatDialog
  ) {
    this.capturarDatos = data
  }

  ngOnInit(): void {
    this.consultarResponsable();
  }

  //Metodo que compara las fechas y deshabilita las fechas superiores al día actual
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

  consultarResponsable() {
    this._listaResponsable.obtenerResponsable().subscribe({
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

  agregarGestionTicket() {
    const fechaDescString: string | null | undefined = this.secondFormGroup.get('fecha')?.value; // Suponiendo que 'fecha' es una cadena en el formato 'YYYY-MM-DD'
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
      responsable: this.thirdFormGroup.get('responsable')?.value,
      ticket: this.capturarDatos.id.toString(),
      desc: this.firstFormGroup.get('descripcion')?.value
    }
    this._gestionTicket.adicionarGestion(body).subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          Swal.fire({
            icon: 'success',
            title: `${value.descripcion},` + ` del ticket ${this.capturarDatos.nombreTicket}`,
            showConfirmButton: false,
            timer: 2000
          })
          this.dialogRef.close()
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
    this.modalPostGestionTicket()
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
