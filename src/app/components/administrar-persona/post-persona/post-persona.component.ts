import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaActividadesService } from '../../services/lista-actividades.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GestionPersonasService } from '../../services/gestion-personas.service';
import { BodyDatosPostPersona } from '../../models/PostBody';
import { Sexo } from '../../models/GetBodyTickets';

@Component({
  selector: 'app-post-persona',
  templateUrl: './post-persona.component.html',
  styleUrls: ['./post-persona.component.scss']
})
export class PostPersonaComponent implements OnInit {

  // Definición de un formulario con controles
  public agregarPersonaForm: FormGroup = new FormGroup({
    numIdentificacion: new FormControl(null, [Validators.required]),
    nombres: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null, [Validators.required]),
    telefono: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(null, [Validators.required]),
    sexo: new FormControl(null, [Validators.required]),
    actividad: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  public actividad: Array<any> = []; // Inicialización de un array para almacenar actividades

  public sexo: Sexo[] = [];  // Variable para almacenar los datos de sexo
  constructor(
    private _listaActividades: ListaActividadesService,
    private _dialogRef: MatDialogRef<PostPersonaComponent>,
    private _gestionPersona: GestionPersonasService,
    private dialogRef: MatDialogRef<PostPersonaComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listaActividades(); // Llama a la función para cargar la lista de actividades
    this.cargarSexo();  // Llama al método para cargar las opciones de sexo
  }

  // Método que filtra las fechas deshabilitando las futuras
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

  listaActividades() {
    this._listaActividades.obtenerActividades().subscribe({
      next: (result) => {
        if (result.codigoRespuesta == "000") {
          this.actividad = result.datos; // Asigna la lista de actividades al array
        } else {
          Swal.fire('Error!', `${result.descripcion}`, 'error');
          this._dialogRef.close(); // Cierra el diálogo en caso de error
        }
      },
      error(err) {
        Swal.fire('Error!', `${err}`, 'error');
      },
    })
  }

  agregarDatos() {
    // Formatea la fecha en formato DD-MM-YYYY
    const fechaDescString: string | null | undefined = this.agregarPersonaForm.get('fechaNacimiento')?.value;
    let fechaFormateada: any = 0;
    if (fechaDescString) {
      const fechaDesc: Date = new Date(fechaDescString);
      const dia = String(fechaDesc.getDate()).padStart(2, '0');
      const mes = String(fechaDesc.getMonth() + 1).padStart(2, '0');
      const anio = fechaDesc.getFullYear();

      fechaFormateada = `${dia}-${mes}-${anio}`;
    }

    // Construye el cuerpo del request
    let body: BodyDatosPostPersona = {
      numIdentificacion: this.agregarPersonaForm.get('numIdentificacion')?.value,
      nombres: this.agregarPersonaForm.get('nombres')?.value,
      apellidos: this.agregarPersonaForm.get('apellidos')?.value,
      direccion: this.agregarPersonaForm.get('direccion')?.value,
      telefono: this.agregarPersonaForm.get('telefono')?.value,
      fechaNacimiento: fechaFormateada,
      sexo: this.agregarPersonaForm.get('sexo')?.value,
      actividad: this.agregarPersonaForm.get('actividad')?.value,
      estado: "1",
      email: this.agregarPersonaForm.get('email')?.value,
    }

    // Envia el request para agregar una persona
    this._gestionPersona.adicionarPersona(body).subscribe({
      next:(value)=> {
          if (value.codigoRespuesta == "000") {
            Swal.fire({
              icon: 'success',
              title: `${value.descripcion},` + ` de la persona ${this.agregarPersonaForm.get('numIdentificacion')?.value}`,
              showConfirmButton: false,
              timer: 2000
            })
            this.dialog.closeAll() // Cierra todos los diálogos
          } else {
            Swal.fire({
              icon: 'error',
              title: `${value.descripcion},` ,
              showConfirmButton: false,
              timer: 3000
            })
            this.dialogRef.close() // Cierra el diálogo
          }
      },
    });
   }

   // Método para cargar las opciones de sexo
  cargarSexo() {
    this.sexo = [
      { value: "M", desc: "Masculino" },
      { value: "F", desc: "Femenino" }
    ]
  }
}
