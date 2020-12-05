import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _API_URI: string = 'https://ctvehicular.pythonanywhere.com/api';

  constructor(
    private http: HttpClient,
  ) {


  }

  //METODO PARA PEDIR AL BACKEND LA POLITICA DE LA EMPRESA
  getPoliticas(){
    const id=2;
    return this.http.get(`${this._API_URI}/police/${id}/`);
  }

  getHistorialToUser(user:string){
    return this.http.get(
      `${this._API_URI}/history/service/provider/`,
      {params:{email:user}}
    );
  }

  getDetallesHistorial(){
    return {
      ranking:3,
      servicios:[
        {
          tipo:"Mudanza",
          cliente: "Elepe",
          fecha: "25/07/2020",
          hora: "14:00",
          calificacion: 5,
          isFinished: true,
          detalles: {
            inicio:{ "lat": -2.2552256, "lng": -79.8926917},
            fin: { "lat": -2.1290807, "lng": -79.8985233},
            metodoPago: "Tarjeta de Credito",
            monto: 4.32
          }
        },
        {
          tipo:"Mudanza VIP",
          cliente: "Estevene",
          fecha: "29/08/2020",
          hora: "16:00",
          calificacion: 5,
          isFinished: true,
          detalles: {
            inicio:{ "lat": -2.1452256, "lng": -79.8226919},
            fin: { "lat": -2.2390807, "lng": -79.8935237},
            metodoPago: "Tarjeta de Debito",
            monto: 8.92
          }
        },{
          tipo:"Mudanza",
          cliente: "Kurt",
          fecha: "15/09/2020",
          hora: "12:00",
          calificacion: 3,
          isFinished: false,
          detalles: {
            inicio:{ "lat": -2.1652256, "lng": -79.8826919},
            fin: { "lat": -2.2294507, "lng": -79.0085237},
            metodoPago: "Tarjeta de Credito",
            monto: 14.32
          }
        },{
          tipo:"Mudanza VIP",
          cliente: "Stech",
          fecha: "30/09/2020",
          hora: "19:00",
          calificacion: 5,
          isFinished: true,
          detalles: {
            inicio:{ "lat": -2.1552256, "lng": -79.8126919},
            fin: { "lat": -2.2290307, "lng": -79.8982237},
            metodoPago: "Tarjeta de Credito",
            monto: 9.60
          }
        },{
          tipo:"Mudanza Regularizada",
          cliente: "Elepe",
          fecha: "1/10/2020",
          hora: "16:00",
          calificacion: 1,
          isFinished: false,
          detalles: {
            inicio:{ "lat": -2.1552256, "lng": -79.8926919},
            fin: { "lat": -2.2290807, "lng": -79.8985237},
            metodoPago: "Tarjeta de Credito",
            monto: 4.32
          }
        },{
          tipo:"Mudanza VIP",
          cliente: "JMJM",
          fecha: "02/11/2020",
          hora: "08:00",
          calificacion: 5,
          isFinished: true,
          detalles: {
            inicio:{ "lat": -2.1552251, "lng": -79.8926219},
            fin: { "lat": -2.2290803, "lng": -79.8985232},
            metodoPago: "Tarjeta de Debito",
            monto: 4.70
          }
        }
      ]
    }
  }

  // getPoliticas() {
  //   const id=2;
  //   this.http.get('https://ionic.io', {}, {})
  // .then(data => {

  //   console.log(data.status);
  //   console.log(data.data); // data received by server
  //   console.log(data.headers);

  // })
  // .catch(error => {

  //   console.log(error.status);
  //   console.log(error.error); // error message as string
  //   console.log(error.headers);

  // });
}

  




/*

//METODO PARA PEDIR AL BACKEND LA POLITICA DE LA EMPRESA
  getPolitica(){
    const id=2;
    return this.http.get(`${this.API_URI}/police/${id}/`);
  }

*/