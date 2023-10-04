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
export class GetGestionComponent implements OnInit{

  public displayedColumns: string [] = ['descripcion', 'responsableId', 'fechaDescri','iconoEditar','iconoEliminar']
  public dataSource: MatTableDataSource<GetGestionTickets> = new MatTableDataSource();
  public capturarId: any = '';
  public id: any = '';
  constructor(
    private _gestionTicket: GestionTicketService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<GetGestionComponent>
  ){
    this.capturarId = data
    this.id = this.capturarId.id
  }

  ngOnInit(): void {
    this.obtenerListaGestion();
  }

  obtenerListaGestion(){
    this._gestionTicket.obtenerGestionTicket(this.id).subscribe({
      next:(value)=> {
          if (value.codigoRespuesta=="000") {
            this.dataSource.data = value.datos;
          } else {
            console.log("Error con sultando ticket")
          }
      },
    })
  }

  eliminarGestion(idGestion:number){
    console.log("Id "+idGestion)
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

  modalGetGestionTicket(id: number, nombreTicket: string) {
    this.dialog.open(GetGestionComponent, {
      data: {
        id: id,
        nombreTicket: nombreTicket
      },
      enterAnimationDuration: 500
    })
  }

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
