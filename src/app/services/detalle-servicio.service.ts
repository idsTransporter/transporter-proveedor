import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetalleServicio } from './../interfaces/detalle-servicio';
import { google } from "google-maps";

declare var google:google;


@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {
  private urlServidor = 'https://jsonplaceholder.typicode.com';
  geocoder= new google.maps.Geocoder();

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

  reverseGeocoding(ubicacion:any){
    this.geocoder.geocode(
      {location:JSON.parse(ubicacion)},
      (
        results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus
      )=>{
        console.log("estatus"+status);
        console.log("LOCATION"+location);
        console.log("UBICACION"+ubicacion);
        if (status === "OK"){
          if(results[0]){
            console.log("detalleSERVICE"+results[0].formatted_address);
            console.log("ubicacionPASADA"+ubicacion)
            return{
              direccion:results[0].formatted_address
            }
          }
          else{
            return{
              direccion:"No se encontró la direccion"
            }
          }
        }
        else{
          console.log("errorSERVICE"+results[0])
          console.log("ERROR DIRECCIÓN"+status);
        }
      }
    );
  }
}