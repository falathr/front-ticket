import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaActividadesService {

  private url = 'http://localhost:8080' + '/ServiciosRest/actividad';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerActividades(): Observable<any>{
    return this._htpp.get(this.url)
  }
}
