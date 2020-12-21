import { Injectable } from '@angular/core';

//Modulo de firebase(authentication) y router(secuencia).
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

import { ToastController } from '@ionic/angular';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userInfor: Observable<firebase.User>;
  public userApp: User;
  public currentUser: any;

  private user;
  public KEY_USER:string;

  constructor(
    private AFauth: AngularFireAuth,
    private router: Router,
    public toastController: ToastController, 
    private storageServ: StorageService,
  ) {
    this.getUserInformation();
    this.getCurrentUser();
  }

  /**
   * Login de respuesta asincrona que en caso de ser exitosa 
   * devuelve un token (auth) con la informacion de la sesion.
   * @correo_electronico
   * @contrasenia
   * @returns una promesa con estados resolve (exito) y reject (fallida).
   */
  async login(correo_electronico: string, contrasenia: string) {
    return new Promise(
      (resolve, reject) => {
        this.AFauth.signInWithEmailAndPassword(correo_electronico, contrasenia)
          .then(res => {

            console.log('Credential: ', res)
            this.KEY_USER = res.user.uid;
            this.setUserInform(res.user);
            //this.setObject(res.user);
            //this.getObject();
            resolve(res)
          }).catch(
            err => {
              console.error('ERROR> En la auth. Linea 16 in auth.service.ts' + err)
              reject(err)
            }
          )
      }
    );
  }


  /**
   * Logout de respuesta asincrona que en caso de ser exitosa 
   * redirecciona a la pantalla de login, sino lanza un error.
   * @returns una promesa 
   */
  logout() {
    return this.AFauth.signOut()
      .then(() => {
        //this.clear();
        this.router.navigate(['/login'])
        console.log('Redirigir')
      }
      ).catch(
        err => {
          console.error('ERROR> En la auth. Linea 42 in auth.service.ts' + err)

        }
      )
  }

  /**
   * Usa el obj AFauth para enviar un correo de recuperacion de contraseña al proveedor que lo solicita.
   * Nota: Se puede personalizar el mensaje enviado desde firebase/console/authentication
   * Pdt: Para probar se recomienda usar un email temporal, debidamente registrado como usuario.
   * @param correo_recuperacion (del proveedor) destino donde se enviara el mensaje
   */
  reset_password(correo_recuperacion: string) {
    if (isNullOrUndefined(correo_recuperacion) || correo_recuperacion == "") {
      this.presentToastFeedback('Debe ingresar un correo electronico.')
      //alert("Debe ingresar un correo electronico.")
    } else {
      this.AFauth.sendPasswordResetEmail(correo_recuperacion)
        .then(
          (res) => {
            console.log("Exito!!! se envio")
            this.presentToastFeedback('Exito!!! se envio al correo de recuperacion');
            this.router.navigate(['/login'])
          }
        ).catch(
          (err) => {
            this.presentToastFeedback("ERROR> Linea 66 auth.service " + err);
            console.error("ERROR> Linea 66 auth.service " + err)
          }
        )
    }
  }

  async presentToastFeedback(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  getUserInformation() {
    this.userInfor = this.AFauth.user;

    this.userInfor.subscribe(
      user => {
        console.log('Infor > ', user);
        this.userApp = {
          uid: user.uid,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }
      }
    );
  }

  getCurrentUser() {
    this.AFauth.onAuthStateChanged(
      user => {
        console.log('Change: ', user);
        this.currentUser = user;
      }
    );
    return this.currentUser;
  }

  setUserInform(user) {
    //this.storageServ.setString('name', this.name);
    this.storageServ.setObject(user.uid, {
      uid: user.uid,
      email: user.email.split('@')[0],
    });
  }

  // getStorageUser() {
  //   // this.storageServ.getString('name').then((data: any) => {
  //   //   if (data.value) {
  //   //     this.storageName = data.value;
  //   //   }
  //   // });
  //   this.storageServ.getObject('user')
  //   .then((data: any) => {
  //     this.person = data;
  //   });
  // }

  clearStorage() {
    this.storageServ.clear();
  }


}
