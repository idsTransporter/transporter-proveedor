import { Injectable } from '@angular/core';

//Modulo de firebase(authentication) y router(secuencia).
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private AFauth: AngularFireAuth,
    private router: Router
  ) { }

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
            console.log(res)
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
      alert("Debe ingresar un correo electronico.")
    } else {
      this.AFauth.sendPasswordResetEmail(correo_recuperacion)
        .then(
          (res) => {
            console.log("Exito!!! se envio")
          }
        ).catch(
          (err) => {
            console.error("ERROR> Linea 66 auth.service " + err)
          }
        )
    }
  }
}
