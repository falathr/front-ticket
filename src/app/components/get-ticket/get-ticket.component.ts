import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { GetGestionComponent } from '../gestion-tickets/get-gestion/get-gestion.component';
import { BodyTickets } from '../models/GetBodyTickets';
import { BodyDatosPost } from '../models/PostBody';
import { GetTickets } from '../models/TablaBodyTicket';
import { GestionTicketService } from '../services/gestion-ticket.service';
import { TicketService } from '../services/post-ticket.service';
import { TicketsService } from '../services/tickets.service';


@Component({
  selector: 'app-get-ticket',
  templateUrl: './get-ticket.component.html',
  styleUrls: ['./get-ticket.component.scss']
})

export class GetTicketComponent implements OnInit {


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  //public Elementos_tabla: GetTickets[] = [];
  public displayedColumns: string[] = ['tipo', 'ticket', 'numeroCaso', 'tema', 'descricion', 'solicitante', 'gerencia', 'fechaSol', 'responsable', 'caso', 'requerido', 'deLey', 'observaciones', 'icono', 'clonar', 'pdf']
  public dataSource: MatTableDataSource<GetTickets>;
  public datosTickets: Array<any> = [];
  public pagina: number = 0;
  public cantidad: number = 100;
  public clonarTicket: boolean = false;
  public numClonadoTick: string = "";
  public datosElemento: any;
  public confirmarClonar: boolean = false;
  public detalleTicket: Array<any> = [];
  constructor(
    private _getTicket: TicketsService,
    private dialog: MatDialog,
    private _postService: TicketService,
    private _dialogRef: MatDialogRef<GetTicketComponent>,
    private _gestionTicket: GestionTicketService,
  ) {
    this.dataSource = new MatTableDataSource(this.datosTickets);

  }
  ngOnInit(): void {
    this.listaTickets(this.pagina, this.cantidad);
  }

  // Método para cambiar de página
  onPageChange(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.listaTickets(this.pagina, this.cantidad);
  }

  //Metodo que lista todos los tickets
  listaTickets(pagina: number, cantidad: number) {
    let body: BodyTickets = {
      datos: []
    };
    if (this.clonarTicket) {
      body = {
        datos: [
          {
            id: "2",
            valor: this.numClonadoTick.toUpperCase(),
            nombreFiltro: "ticket"
          }
        ]
      };
    }
    this._getTicket.obtenerTicket(body, pagina, cantidad).subscribe({
      next: (response) => {
        if (response.codigoRespuesta == "000") {
          if (response.datos == null) {
            console.log(response.descripcionRespuesta);
          } else if (!this.clonarTicket) {
            this.dataSource.data = response.datos;
            this.dataSource.paginator = this.paginator;
          } else {
            this.confirmarClonar = false;
            Swal.fire({
              icon: 'warning',
              title: 'Ya existe el ticket ' + `${this.numClonadoTick}`,
              text: 'Por favor validar e intente de nuevo',
            }).then((result) => {
              if (result.isConfirmed) {
                this.modalClonarTicket(this.datosElemento);
              }
            })
          }
        } else if (response.codigoRespuesta == "001") {
          if (this.clonarTicket) {
            this.confirmarClonar = true;
            // console.log("Valida la confirmación: " + this.confirmarClonar);
          }
          if (this.confirmarClonar) {
            // console.log("Entro aquí para insertar")
            this.postTicket(this.datosElemento);
          }
        } {

        }
      }
    });
  }

  //Metodo que aplica los filtros a la tabla del codigo
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Metodo que abre el modal de gestión ticket
  modalGetGestionTicket(id: number, nombreTicket: string) {
    this.dialog.open(GetGestionComponent, {
      data: {
        id: id,
        nombreTicket: nombreTicket
      },
      enterAnimationDuration: 500
    })
  }

  //Metodo para clonar un ticket
  modalClonarTicket(elemnt: any) {
    this.datosElemento = elemnt;
    console.log("Elemento aqui " + JSON.stringify(elemnt))
    Swal.fire({
      icon: 'warning',
      title: 'Escriba el nuevo Ticket',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: (respuesta) => {
        this.numClonadoTick = respuesta;
        this.clonarTicket = true;
        console.log("respuesta " + respuesta);
        if (respuesta == "") {
          Swal.showValidationMessage(
            `Nombre del ticket obligatorio`
          )
        }
        this.listaTickets(this.pagina, this.cantidad)
      }
    })

  }

  //Metodo para guardar el ticket clonado
  postTicket(elemnt: any) {
    const fechaDescString: string | null | undefined = elemnt.fechaSol;
    let fechaFormateada: any = 0;
    if (fechaDescString) {
      const fechaDesc: Date = new Date(fechaDescString);
      const dia = String(fechaDesc.getDate()).padStart(2, '0');
      const mes = String(fechaDesc.getMonth() + 1).padStart(2, '0');
      const anio = fechaDesc.getFullYear();

      fechaFormateada = `${dia}-${mes}-${anio}`;
    }
    let bodyTickets: BodyDatosPost = {
      tema: elemnt.tema.toString(),
      ticket: this.numClonadoTick.toUpperCase(),
        numeroCaso: elemnt.numeroCaso,
        tipo: elemnt.tipo.toString(),
      descripcion: elemnt.descricion,
      solicitante: elemnt.solicitante.toString(),
      gerencia: elemnt.gerencia.toString(),
      fechaSol: fechaFormateada,
      responsable: elemnt.responsable.toString(),
      estadoTI: elemnt.caso.toString(),
      requerido: elemnt.requerido.toString(),
      deLey: elemnt.deLey.toString(),
      observaciones: elemnt.observaciones,
    }
    this._postService.adicionarTicket(bodyTickets).subscribe({
      next: (value) => {
        if (value.codigoRespuesta == "000") {
          Swal.fire('Ticket clonado!', `${value.descripcion}` + ` del ticket # ${this.numClonadoTick.toUpperCase()}`, 'success');
          this._dialogRef.close();
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //Metodo para generar el PDF de un ticket
  generatePDF(data: any) {
    console.log("Ticket: " + JSON.stringify(data))
    const doc = new jsPDF();
    let y = 40; // Posición vertical inicial
    const lineHeight = 8;
    const cellPadding = 2;
    // Agregar imagen
    doc.addImage('assets/famisanar.jpeg', 'JPEG', 5, 10, 60, 4); // Ajusta las coordenadas y dimensiones según sea necesario
    doc.line(10, y, 200, y); // Línea superior de la tabla
    // Agregar contenido al PDF
    this.obtenerListaGestion(data.id)
      .then((exito) => {
        console.log("Consulta exitosa 1");
        const dataArray = [
          ['Campo', 'Detalle'],
          ['Descripción De Ley', data.descDeLey],
          ['Tipo', data.descTipo],
          ['Ticket', data.ticket],
          ['Tema', data.descTema],
          ['Descripción', data.descricion],
          ['Solicitante', data.descSolicitante],
          ['Gerencia', data.descGerencia],
          ['Fecha Solución', data.fechaSol],
          ['Responsable', data.descResponsable],
          ['Estado TI', data.descCaso],
          ['Requerido', data.descRequerido],
          ['Observaciones', data.observaciones],
        ];
        doc.text('Información general del ticket ' + `${data.ticket}`, 40, 30);
        dataArray.forEach((row, index) => {
          let x = 10; // Posición horizontal inicial
          let extraSpace = 0;
          if (index === 0) {
            // Color de fondo para la primera fila (título)
            doc.setFillColor(211, 211, 211); // Puedes ajustar los valores RGB según el color que desees
            doc.rect(10, y, 190, lineHeight, 'F'); // Dibuja un rectángulo con el color de fondo
          }
          row.forEach((cell) => {
            const textArray = doc.splitTextToSize(cell, 120); // Ajusta según sea necesario
            const lines = textArray.length;
            // Calcula el espacio extra debido al salto de línea
            extraSpace = (lines - 1) * lineHeight;
            doc.text(textArray, x + cellPadding, y + lineHeight - cellPadding);
            doc.line(x, y, x, y + lineHeight + extraSpace);
            x += 70; // Ajusta el espacio entre las columnas
          });
          y += lineHeight + extraSpace; // Ajusta la posición vertical para la siguiente fila
          doc.setLineWidth(0.1);
          doc.line(10, y, 200, y);
        });

        // Línea vertical conectando con la última línea horizontal
        doc.line(10, 40, 10, y);

        doc.line(200, 40, 200, y);
        // Guardar el PDF
        doc.text('Información general del detalle del ticket', 40, y + 10);

        if (this.detalleTicket?.length > 0) {
          console.log("Consulta exitosa 2");
          let tabla2Y = y + 20; // Coordenada y para la segunda tabla

          // Línea superior de la segunda tabla
          doc.line(10, tabla2Y, 200, tabla2Y);

          for (let datos of this.detalleTicket) {
            const dataArray2 = [
              ['Campo', 'Detalle'],
              ['Descripción', datos.descripcion],
              ['Responsable', datos.descResponsable],
              ['Fecha descripción', datos.fechaDescri],
            ];

            dataArray2.forEach((row, index) => {
              let x = 10; // Posición horizontal inicial
              let extraSpace = 0;
              if (index === 0) {
                // Color de fondo para la primera fila (título)
                doc.setFillColor(211, 211, 211); // Puedes ajustar los valores RGB según el color que desees
                doc.rect(10, tabla2Y, 190, lineHeight, 'F'); // Dibuja un rectángulo con el color de fondo
              }
              row.forEach((cell) => {
                const textArray = doc.splitTextToSize(cell, 120); // Ajusta según sea necesario
                const lines = textArray.length;
                // Calcula el espacio extra debido al salto de línea
                extraSpace = (lines - 1) * lineHeight;
                doc.text(textArray, x + cellPadding, tabla2Y + lineHeight - cellPadding);
                doc.line(x, tabla2Y, x, tabla2Y + lineHeight + extraSpace);
                x += 70; // Ajusta el espacio entre las columnas
              });

              tabla2Y += lineHeight + extraSpace; // Ajusta la posición vertical para la siguiente fila
              doc.setLineWidth(0.1);
              doc.line(10, tabla2Y, 200, tabla2Y);
            });
          }
          // Línea vertical final de la segunda tabla
          doc.line(200, y + 20, 200, tabla2Y);
        } else {
          console.log("Consulta sin datos");
          doc.text('¡No hay detalles del ticket!', 10, y + 20);
        }
        doc.save('informacion_ticket_' + `${data.ticket}` + '.pdf');
      })
      .catch((error) => {
        console.log("Error en la consulta");
        // Aquí puedes manejar el error en caso de que la consulta falle
      });
  }

  //Metodo para obtener la lista de la gestión de un tramite
  obtenerListaGestion(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._gestionTicket.obtenerGestionTicket(id).subscribe({
        next: (value) => {
          if (value.codigoRespuesta == "000" || value.codigoRespuesta == "001") {
            this.detalleTicket = value.datos;
            console.log("Detalle " + JSON.stringify(this.detalleTicket));
            resolve(true); // Resuelve la promesa si la consulta es exitosa
          } else {
            console.log("Error consultando ticket");
            reject(false); // Rechaza la promesa si hay un error
          }
        },
      });
    });
  }
}
