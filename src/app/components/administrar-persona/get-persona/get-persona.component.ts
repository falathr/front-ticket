import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetPersona } from '../../models/TablaBodyTicket';  // Importación de modelo
import { GestionPersonasService } from '../../services/gestion-personas.service';  // Importación de servicio
import Swal from 'sweetalert2';  // Importación de SweetAlert
import { MatDialog, MatDialogRef } from '@angular/material/dialog';  // Importación de MatDialog
import { PostPersonaComponent } from '../post-persona/post-persona.component';  // Importación de componente
import { PutPersonaComponent } from '../put-persona/put-persona.component';  // Importación de componente

@Component({
  selector: 'app-get-persona',
  templateUrl: './get-persona.component.html',
  styleUrls: ['./get-persona.component.scss']
})
export class GetPersonaComponent implements OnInit {

  // Definición de columnas a mostrar en la tabla
  public displayedColumns: string[] = ['numeroIdentificacion', 'nombres', 'apellidos', 'direccion', 'telefono', 'email', 'fechaNacimiento', 'sexo', 'desActividad', 'activo', 'iconoEditar', 'iconoEliminar']

  // Creación de una fuente de datos para la tabla, especificando el tipo de datos que contendrá
  public dataSource: MatTableDataSource<GetPersona> = new MatTableDataSource();

  constructor(
    private _administrarPersona: GestionPersonasService,  // Inyección de servicio
    private dialogRef: MatDialogRef<GetPersonaComponent>,  // Referencia al diálogo actual
    private dialog: MatDialog  // Servicio para abrir diálogos
  ) {

  }

  ngOnInit(): void {
    this.consultarPersonas();  // Al inicializar el componente, se consulta la lista de personas
  }

  // Método para consultar la lista de personas
  consultarPersonas() {
    this._administrarPersona.obtenerListaPersonas().subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          this.dataSource.data = value.datos;  // Si la respuesta es exitosa, se actualiza la fuente de datos de la tabla
        } else {
          console.log("Error consultando ticket")  // Si hay un error, se imprime en la consola
        }
      },error: (error) => {
        console.log(error);  // Si hay un error, se imprime en la consola
      }
    });
  }

  // Método para abrir el diálogo de edición de persona
  modalPutPersona(element: any) {
    this.dialog.open(PutPersonaComponent, {
      data: {
        // Datos de la persona que se pasan al componente de edición
        id: element.id,
        numeroIdentificacion: element.numeroIdentificacion,
        nombres: element.nombres,
        apellidos: element.apellidos,
        direccion: element.direccion,
        telefono: element.telefono,
        email: element.email,
        fechaNacimiento: element.fechaNacimiento,
        sexo: element.sexo,
        actividad: element.actividad,
        desActividad: element.desActividad,
        estado: element.estado,
        desEstado: element.desEstado
      },
      enterAnimationDuration: 500  // Duración de la animación al abrir el diálogo
    })
    this.dialogRef.close();  // Se cierra el diálogo actual
  }

  // Método para eliminar una persona
  eliminarPersona(id: number, identificacion: number) {

      Swal.fire({
        title: '¿Está seguro de eliminar?',
        text: "¿Desea eliminar la persona con identificación: " + `${identificacion}` + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this._administrarPersona.borrarPersona(id).subscribe({
            next:(value)=> {
                if (value.codigoRespuesta == "000") {
                  Swal.fire({
                    icon: 'success',
                    title: `${value.descripcion}`,
                    showConfirmButton: false,
                    timer: 1800
                  })
                  this.dialogRef.close();  // Se cierra el diálogo actual
                }
            },
          })
        }
      })

   }

  // Método para abrir el diálogo de creación de persona
  modalPostPersona() {
    this.dialog.open(PostPersonaComponent, {
      enterAnimationDuration: 500  // Duración de la animación al abrir el diálogo
    })
  }
}
