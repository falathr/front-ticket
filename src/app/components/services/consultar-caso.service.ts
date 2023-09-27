import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarCasoService {

  private url = 'http://localhost:8080' + '/ServiciosRest/casos';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerCasos(): Observable<any>{
    return this._htpp.get(this.url)
  }
}
