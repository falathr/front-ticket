import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyDatosPost } from '../models/PostBody';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private url = 'http://localhost:8080' + '/ServiciosRest/ticket';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //metodo Post
  adicionarTicket(ticket: BodyDatosPost): Observable<any> {

    return this._htpp.post(this.url, ticket);
  }

  //Metodo Put
  actualizarTicket(id:number, ticket: BodyDatosPost): Observable<any>{
    return this._htpp.put(this.url+"/"+`${id}`, ticket)
  }

  //Metodo Delete
  borrarTicket(id:number): Observable<any>{
    return this._htpp.delete(this.url+"/"+`${id}`)
  }

}
