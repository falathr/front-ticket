import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private url = 'http://localhost:8080' + '/ServiciosRest/tickets';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerTicket(body: any, pagina:number, cantidad: number): Observable<any>{
    const header: HttpHeaders = new HttpHeaders({
      "pageNumber": pagina
    })

    return this._htpp.post(this.url, body, {headers:header})
  }

}
