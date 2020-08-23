import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetalleServicio } from './../interfaces/detalle-servicio';

@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {
  private urlServidor = 'https://jsonplaceholder.typicode.com';

  constructor(
    private http:HttpClient
  ) { }
  
  
  getTask(id: string) {
    const path = `${this.urlServidor}/users/${id}`;
    return this.http.get<DetalleServicio>(path);
  }

  updateTask(servicio: DetalleServicio) {
    const path = `${this.urlServidor}/users/${servicio.id}`;
    return this.http.put<DetalleServicio>(path, servicio);
  }

}
