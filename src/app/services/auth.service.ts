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

  public userInfor: Observable<firebase.User | null>;
  public userApp: User;


  // public currentUser: any;

  //Para autenticacion fb y get datos
  public userFirebase: Observable<firebase.User | null>;

  constructor(
    private AFauth: AngularFireAuth,
    private router: Router,
    public toastController: ToastController,
    private storage: StorageService,
  ) {
    //State
    this.userFirebase = this.AFauth.authState;
  }

  /**
   * Login de respuesta asincrona que en caso de ser exitosa 
   * devuelve un token (auth) con la informacion de la sesion.
   * @correo_electronico
   * @contrasenia
   * @returns una promesa con estados resolve (exito) y reject (fallida).
   */
  login(correo_electronico: string, contrasenia: string) {
    return new Promise(
      (resolve, reject) => {
        this.AFauth.signInWithEmailAndPassword(correo_electronico, contrasenia)
          .then(res => {
            console.log('Credential: ', res)
            console.log(typeof res);

            
            console.log("auth value> "+this.userFirebase);
            console.log("auth type> "+ typeof(this.userFirebase));

            resolve(res)
          }).catch(err => {
            console.log('Error: ', err);
            console.log(typeof err);
            console.error('ERROR> En la auth. Linea 16 in auth.service.ts' + err);
            reject(err)
          }
          )
      }
    );
  }

  // Obtener el estado de autenticación
  get authenticated(): boolean {
    return this.userFirebase != null; // True ó False
  }

  // Obtener el observador del usuario actual
  get currentUser(): Observable<firebase.User | null> {
    return this.userFirebase;
  }

  // getUserInformation() {
  //   this.userInfor = this.AFauth.user;

  //   this.userInfor.subscribe(
  //     user => {
  //       if (user) {
  //         console.log('Infor auth user> ', user);
  //         this.userApp = {
  //           uid: user.uid,
  //           email: user.email,
  //           phoneNumber: user.phoneNumber,
  //         }
  //         console.log('Infor auth userApp> ', this.userApp);
  //       }
  //     },
  //     error => {
  //       console.error("Ah ocurrido un error: " + error);
  //     }
  //   );
  // }


  /**
   * Logout de respuesta asincrona que en caso de ser exitosa 
   * redirecciona a la pantalla de login, sino lanza un error.
   * @returns una promesa 
   */
  logout() {
    return this.AFauth.signOut()
      .then(() => {
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

  // getCurrentUser() {
  //   this.AFauth.onAuthStateChanged(
  //     user => {
  //       console.log('Change: ', user);
  //       this.currentUser = user;
  //     }
  //   );
  //   return this.currentUser;
  // }
}
