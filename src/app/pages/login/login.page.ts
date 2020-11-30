import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

//Servicio para la authentication con firebase y el ruteo entre apaginas
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'

//Importar el Ctrl de Toast (Feedback)
import { ToastController } from '@ionic/angular';
//Importar el Loading (Feedback)
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo_electronico: string
  contrasenia: string

  showPassword = false;
  passwordIcon = 'eye';

  constructor(
    private auth_service: AuthService,
    public router: Router,
    public toastController: ToastController,
    private ionLoader: LoaderService,
  ) { }

  ngOnInit() {
  }

  /** 
   * Metodo para entrar a la sesion procesa una promesa de auth.service.ts
   */
  on_submit_login() {
    console.log("Dio click al iniciar sesion");
    this.ionLoader.showLoader();
    //Cachar la promise del service/auth
    this.auth_service.login(this.correo_electronico, this.contrasenia)
      .then(//Respuesta positiva
        res => {
          console.log(res);
          console.log(typeof res);
          
          this.ionLoader.hideLoader();
          this.router.navigate(['/tabs']);
          this.correo_electronico = "";
          this.contrasenia = "";
        }
      ).catch(
        err => {
          let errorMsg = this.handlerError(err);
          //Verificar si es un Network Error
          this.ionLoader.hideLoader();
          this.presentToastFeedback(errorMsg);
        }
      );
  }

  /**
   * Retorna un mensaje de error dependiendo del tipo de error.
   * @param err objeto que almacena informacion del error como: code, message 
   */
  private handlerError(err: any) {
    let errorCode = err.code;
    let errorMessage = err.message;
    // console.error(errorMessage);
    // console.error(typeof err);
    // console.error(err);
    switch (errorCode) {
      case "auth/invalid-email": {
        errorMessage = "La dirección de correo electrónico no es válida.";
        break;
      }
      case "auth/user-disabled": {
        errorMessage = "El usuario correspondiente al correo electrónico dado ha sido deshabilitado.";
        break;
      }
      case "auth/user-not-found": {
        errorMessage = "No hay ningún usuario correspondiente al correo electrónico dado.";
        break;
      }
      case "auth/wrong-password": {
        errorMessage = "La contraseña no es válida para el correo electrónico dado." +
          "\nO la cuenta correspondiente al correo electrónico no tiene una contraseña configurada.";
        break;
      }
      case "auth/argument-error": {
        errorMessage = "El correo electronico debe ser un texto valido (no vacio).";
        break;
      }
      default: {
        errorMessage = "Error> " + err;
        break;
      }
    }
    return errorMessage;
  }

  /**
   * Despliega un mensaje que informa al usuario del tipo de error.
   * @param error contiene el error a presentarse
   */
  async presentToastFeedback(error: string) {
    const toast = await this.toastController.create({
      message: error,
      position: 'top',
      duration: 2500
    });
    toast.present();
    this.ionLoader.hideLoader();
  }

  async presentToastFeedbackWithOptions(err: string) {
    const toast = await this.toastController.create({
      header: err,
      message: err,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
    this.ionLoader.hideLoader();
  }

  /**
   * Cambia el icono al momento de ver la contrasenia
   */
  iconPassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordIcon == 'eye') {
      this.passwordIcon = 'eye-off';
    }
    else {
      this.passwordIcon = 'eye';
    }
  }

}
