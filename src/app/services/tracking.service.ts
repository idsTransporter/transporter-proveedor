import { Injectable } from '@angular/core';
// For RealTime DB
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  listRef: AngularFireList<any>;
  private watch: any;
  user: any;
  emailUser:string;

  constructor(
    //private geolocation: Geolocation,
    db: AngularFireDatabase,
    private userAuth: AuthService,
  ) {
    if( !this.userAuth.KEY_USER ) {
      return;
    }
   this.listRef = db.list("/usuarios/");
   this.emailUser=this.userAuth.userApp.email;
  }


  initTracking(data) {
    console.log("EL UID DE ERROR> " + this.userAuth.KEY_USER);
    console.log("Email usuario", this.emailUser)
    if (!this.userAuth.KEY_USER) {
      console.log('ERROR en el UID');
      return;
    }

    let clave = this.userAuth.KEY_USER;
    this.listRef.update(clave, { lat: data.coords.latitude, lng: data.coords.longitude });


    // let clave = this.us.clave;
    // this.usuario.update( clave, {lat: data.coords.latitude, lng: data.coords.longitude } );


  }

  detener_watch() {
    //this.watch.unsubscribe();
    this.listRef.remove(this.userAuth.KEY_USER);
  }


  sendInfo(servicio){
    let clave = this.userAuth.KEY_USER;
    this.listRef.update(clave, {email: this.emailUser, inicio: servicio.inicio, fin: servicio.fin,
       hora: servicio.detalleServicio.data.hora, metodoPago:servicio.detalleServicio.data.metodoPago,
      valor: servicio.detalleServicio.data.valor});
      console.log("Enviado: ",servicio.inicio, servicio.detalleServicio.data.valor);
  }

}
