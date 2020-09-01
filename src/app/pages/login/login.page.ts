import { Component, OnInit } from '@angular/core';

//Servicio para la authentication con firebase y el ruteo entre apaginas
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

//Importar el Ctrl de Toast (Feedback)
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo_electronico: string
  contrasenia: string

  constructor(
    private auth_service: AuthService, 
    public router:Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  on_submit_login(){
    console.log("Dio click al iniciar sesion");
    //Cachar la promise del service/auth
    this.auth_service.login(this.correo_electronico,this.contrasenia)
    .then(//Respuesta positiva
      res => this.router.navigate(['/tabs'])
    ).catch(
      err => this.presentToastFeedback()
    );
  }

  
  async presentToastFeedback() {
    const toast = await this.toastController.create({
      message: 'Usuario/cotrasenia incorrectos',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async presentToastFeedbackWithOptions(err) {
    const toast = await this.toastController.create({
      header: 'Usuario/cotrasenia incorrectos',
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
  }
}
