import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsutlarPeronaResponsableService {

  private url = 'http://localhost:8080' + '/ServiciosRest/personaResponsable';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerPersonaResponsable(): Observable<any>{
    return this._htpp.get(this.url)
  }
}
