import { Injectable } from '@angular/core';
// For RealTime DB
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  listRef: AngularFireList<any>;
  private watch:any;
  user;

  constructor(
    private geolocation: Geolocation,
    db: AngularFireDatabase,
    private userAuth: AuthService,
  ) {
    this.user = this.userAuth.getObject();
    if(!this.user){
      return;
    }
    this.listRef= db.list('/users/');
   }

  initTracking(data){
    if( !this.user.uid ) {
      console.log('ERROR en el UID');
      return;
    }

    let clave = this.user.clave;
    this.listRef.update( clave, {lat: data.coords.latitude, lng: data.coords.longitude } );


    // let clave = this.us.clave;
    // this.usuario.update( clave, {lat: data.coords.latitude, lng: data.coords.longitude } );


  }

  detener_watch() {
    this.watch.unsubscribe();
  }

}
