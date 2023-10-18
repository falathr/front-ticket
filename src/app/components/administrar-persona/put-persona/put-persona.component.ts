import { Component, OnInit, Inject } from '@angular/core';
import { ListaActividadesService } from '../../services/lista-actividades.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sexo } from '../../models/GetBodyTickets';
import { BodyDatosPostPersona } from '../../models/PostBody';
import { GestionPersonasService } from '../../services/gestion-personas.service';

@Component({
  selector: 'app-put-persona',
  templateUrl: './put-persona.component.html',
  styleUrls: ['./put-persona.component.scss']
})
export class PutPersonaComponent implements OnInit {

  // Formulario para agregar una persona
  public agregarPersonaForm: FormGroup = new FormGroup({
    numIdentificacion: new FormControl({ value: null, disabled: true }, [Validators.required]),
    nombres: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null, [Validators.required]),
    telefono: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(null, [Validators.required]),
    sexo: new FormControl(null, [Validators.required]),
    actividad: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  public actividad: Array<any> = [];  // Variable para almacenar la lista de actividades
  public capturarDatos: any = '';  // Variable para capturar los datos recibidos
  public sexo: Sexo[] = [];  // Variable para almacenar los datos de sexo

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _listaActividades: ListaActividadesService,
    private _dialogRef: MatDialogRef<PutPersonaComponent>,
    private _gestionPersona: GestionPersonasService
  ) {
    this.capturarDatos = data;  // Captura los datos recibidos al inicializar el componente
  }

  ngOnInit(): void {
    this.listaActividades();  // Llama al método para obtener la lista de actividades
    this.cargarDatos();  // Llama al método para cargar los datos en el formulario
    this.cargarSexo();  // Llama al método para cargar las opciones de sexo
  }

  // Método que compara las fechas y deshabilita las fechas superiores al día actual
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = (d || today).getTime();
    return day <= today.getTime();
  };

  // Método para obtener la lista de actividades
  listaActividades() {
    this._listaActividades.obtenerActividades().subscribe({
      next: (result) => {
        if (result.codigoRespuesta == "000") {
          this.actividad = result.datos;  // Asigna la lista de actividades
        } else {
          Swal.fire('Error!', `${result.descripcion}`, 'error');
          this._dialogRef.close();
        }
      },
      error(err) {
        Swal.fire('Error!', `${err}`, 'error');
      },
    })
  }

  // Método para cargar los datos en el formulario de edición
  cargarDatos() {
    let fechaOriginal = new Date(this.capturarDatos.fechaNacimiento); // Convierte la cadena a un objeto de fecha
    let fechaSumada = new Date(fechaOriginal.getTime()); // Crea una copia para no modificar la original

    fechaSumada.setDate(fechaOriginal.getDate() + 1); // Suma un día

    // Asigna los valores a los campos del formulario
    this.agregarPersonaForm.patchValue({
      numIdentificacion: this.capturarDatos.numeroIdentificacion,
      fechaNacimiento: fechaSumada,
      nombres: this.capturarDatos.nombres,
      apellidos: this.capturarDatos.apellidos,
      direccion: this.capturarDatos.direccion,
      telefono: this.capturarDatos.telefono,
      sexo: this.capturarDatos.sexo.toString(),
      actividad: this.capturarDatos.actividad.toString(),
      email: this.capturarDatos.email
    })
  }

  // Método para cargar las opciones de sexo
  cargarSexo() {
    this.sexo = [
      { value: "M", desc: "Masculino" },
      { value: "F", desc: "Femenino" }
    ]
  }

  // Método para actualizar los datos de una persona
  actualizarDatos() {
    const fechaDescString: string | null | undefined = this.agregarPersonaForm.get('fechaNacimiento')?.value;

    let fechaFormateada: any = 0;
    if (fechaDescString) {
      const fechaDesc: Date = new Date(fechaDescString);
      const dia = String(fechaDesc.getDate()).padStart(2, '0');
      const mes = String(fechaDesc.getMonth() + 1).padStart(2, '0');
      const anio = fechaDesc.getFullYear();

      fechaFormateada = `${dia}-${mes}-${anio}`;
    }

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

    this._gestionPersona.actualizarPersona(this.capturarDatos.id, body).subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          Swal.fire('Actualizado!', `${value.descripcion}` + " de la persona: " + `${this.agregarPersonaForm.get('numIdentificacion')?.value}`, 'success');
          this._dialogRef.close();
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
