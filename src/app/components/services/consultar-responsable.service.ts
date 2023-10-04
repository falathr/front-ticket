import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarResponsableService {

  private url = 'http://localhost:8080' + '/ServiciosRest/responsable';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerResponsable(): Observable<any>{
    return this._htpp.get(this.url)
  }
}
