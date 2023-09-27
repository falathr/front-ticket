import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarTemasService {

  private url = 'http://localhost:8080' + '/ServiciosRest/temas';

  constructor(
    private _htpp: HttpClient,
  ) { }

  //Metodo get
  obtenerTemas(): Observable<any>{
    return this._htpp.get(this.url)
  }
}
