import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarGerenciaService {

  private url = 'http://localhost:8080' + '/ServiciosRest/gerencias';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerGerecias(): Observable<any>{
    return this._htpp.get(this.url)
  }
}
