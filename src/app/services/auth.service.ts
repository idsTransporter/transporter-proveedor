import { Injectable } from '@angular/core';

//Modulo de firebase(suthentication) y router(secuencia).
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';

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
  async logout() {
    try {
      await this.AFauth.signOut();
      this.router.navigate(['/login']);
      console.log('Redirigir');
    }
    catch (err) {
      console.error('ERROR> En la auth. Linea 42 in auth.service.ts' + err);
    }
  }
}
