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
            inicio:{},
            fin: {},
            metodoPago: {},
            monto: {}
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
            inicio:{},
            fin: {},
            metodoPago: {},
            monto: {}
          }
        },{
          tipo:"Mudanza",
          cliente: "Kurt",
          fecha: "15/09/2020",
          hora: "12:00",
          calificacion: 3,
          isFinished: false,
          detalles: {
            inicio:{},
            fin: {},
            metodoPago: {},
            monto: {}
          }
        },{
          tipo:"Mudanza VIP",
          cliente: "Stech",
          fecha: "30/09/2020",
          hora: "19:00",
          calificacion: 5,
          isFinished: true,
          detalles: {
            inicio:{},
            fin: {},
            metodoPago: {},
            monto: {}
          }
        },{
          tipo:"Mudanza Regularizada",
          cliente: "Elepe",
          fecha: "1/10/2020",
          hora: "16:00",
          calificacion: 1,
          isFinished: false,
          detalles: {
            inicio:{},
            fin: {},
            metodoPago: {},
            monto: {}
          }
        },{
          tipo:"Mudanza VIP",
          cliente: "JMJM",
          fecha: "02/11/2020",
          hora: "08:00",
          calificacion: 5,
          isFinished: true,
          detalles: {
            inicio:{},
            fin: {},
            metodoPago: {},
            monto: {}
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