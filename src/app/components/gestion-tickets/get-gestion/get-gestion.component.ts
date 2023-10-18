import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { GetGestionTickets } from '../../models/TablaBodyTicket';
import { GestionTicketService } from '../../services/gestion-ticket.service';
import { PostGestionComponent } from '../post-gestion/post-gestion.component';
import { PutGestionComponent } from '../put-gestion/put-gestion.component';

@Component({
  selector: 'app-get-gestion',
  templateUrl: './get-gestion.component.html',
  styleUrls: ['./get-gestion.component.scss']
})
export class GetGestionComponent implements OnInit {

  // Definición de columnas a mostrar en la tabla
  public displayedColumns: string [] = ['descripcion', 'responsableId', 'fechaDescri','iconoEditar','iconoEliminar']

  // Fuente de datos para la tabla
  public dataSource: MatTableDataSource<GetGestionTickets> = new MatTableDataSource();

  // Variable para capturar el ID y otros datos
  public capturarId: any = '';

  // Variable para almacenar el ID
  public id: any = '';

  constructor(
    private _gestionTicket: GestionTicketService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<GetGestionComponent>
  ){
    // Capturar datos inyectados
    this.capturarId = data
    this.id = this.capturarId.id
  }

  ngOnInit(): void {
    // Inicializar componente, cargar datos, etc.
    this.obtenerListaGestion();
  }

  // Método para obtener la lista de gestiones
  obtenerListaGestion() {
    this._gestionTicket.obtenerGestionTicket(this.id).subscribe({
      next:(value)=> {
          if (value.codigoRespuesta=="000") {
            this.dataSource.data = value.datos;
          } else {
            console.log("Error consultando ticket")
          }
      },
    })
  }

  // Método para eliminar una gestión
  eliminarGestion(idGestion:number) {
    Swal.fire({
      title: 'Esta seguro de eliminar?',
      text: "eliminar la gestión del ticket "+`${this.capturarId.nombreTicket}`+"?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._gestionTicket.borrarGestion(idGestion).subscribe({
          next:(value)=> {
              if (value.codigoRespuesta == "000") {
                Swal.fire({
                  icon: 'success',
                  title: `${value.descripcion}`,
                  showConfirmButton: false,
                  timer: 2000
                })
                this.dialogRef.close()
                this.modalGetGestionTicket(this.id, this.capturarId.nombreTicket);
              }
          },
        })
      }
    })
  }

  // Método para abrir un modal de gestión (Get)
  modalGetGestionTicket(id: number, nombreTicket: string) {
    this.dialog.open(GetGestionComponent, {
      data: {
        id: id,
        nombreTicket: nombreTicket
      },
      enterAnimationDuration: 500
    })
  }

  // Método para abrir un modal de gestión (Post)
  modalPostGestionTicket() {
    this.dialog.open(PostGestionComponent, {
      data: {
        id: this.id,
        nombreTicket: this.capturarId.nombreTicket
      },
      enterAnimationDuration: 500
    })
    this.dialogRef.close()
  }

  // Método para abrir un modal de gestión (Put)
  modalPutGestionTicket(element: any) {
    this.dialog.open(PutGestionComponent, {
      data: {
        id: this.id,
        nombreTicket: this.capturarId.nombreTicket,
        fecha: element.fechaDescri,
        desc: element.descripcion,
        responsable: element.responsableId,
        elementId: element.id
      },
      enterAnimationDuration: 500
    })
    this.dialogRef.close()
  }
}
