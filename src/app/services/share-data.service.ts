import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  //notificacion:{}=null;
  notificacion: object ={};

  //Es un Observable
  nombreNot$=new EventEmitter<string>();


  //Es un observable
  notObj$=new EventEmitter<object>();

  constructor() { }
}
