import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyDatosPostPersona } from '../models/PostBody';

@Injectable({
  providedIn: 'root'
})
export class GestionPersonasService {

  private url = 'http://localhost:8080' + '/ServiciosRest/persona';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerListaPersonas(): Observable<any>{
    return this._htpp.get(this.url)
  }

   //metodo Post
   adicionarPersona(persona: BodyDatosPostPersona): Observable<any> {

     return this._htpp.post(this.url, persona);
  }

  //Metodo Put
  actualizarPersona(id:number, persona: BodyDatosPostPersona): Observable<any>{
    return this._htpp.put(this.url+"/"+`${id}`, persona)
  }

  //Metodo Delete
  borrarPersona(id:number): Observable<any>{
    return this._htpp.delete(this.url+"/"+`${id}`)
  }
}
