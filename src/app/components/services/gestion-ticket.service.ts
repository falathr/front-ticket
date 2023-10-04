import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyDatosPost, BodyDatosPostGestion } from '../models/PostBody';

@Injectable({
  providedIn: 'root'
})
export class GestionTicketService {

  private url = 'http://localhost:8080' + '/ServiciosRest/gestion';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerGestionTicket(id:number): Observable<any>{
    return this._htpp.get(this.url+"/"+`${id}`)
  }

   //metodo Post
   adicionarGestion(ticket: BodyDatosPostGestion): Observable<any> {

     return this._htpp.post(this.url, ticket);
  }

  //Metodo Put
  actualizarGestion(id:number, ticket: BodyDatosPostGestion): Observable<any>{
    return this._htpp.put(this.url+"/"+`${id}`, ticket)
  }

  //Metodo Delete
  borrarGestion(id:number): Observable<any>{
    return this._htpp.delete(this.url+"/"+`${id}`)
  }
}
