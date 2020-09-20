import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import{DetalleServicioService} from 'src/app/services/detalle-servicio.service';


//Para las push notifications
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed 
} from '@capacitor/core';

const { PushNotifications } = Plugins;

import { Router } from '@angular/router';

//Alertas de manera local
import { AlertController } from '@ionic/angular';
//Compartir la data a traves de un service
import { ShareDataService } from './services/share-data.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
   geocoder = new google.maps.Geocoder();

  constructor(
    private AFauth: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private shareData: ShareDataService,
    private router: Router,
    private detalle:DetalleServicioService,

  ) {
    this.initializeApp();
  }
   
  ngOnInit() {
    console.log('Initializing HomePage');

    /*
    * Solicitar permiso para usar notificaciones push
    * iOS solicitará al usuario y regresará si les concedió permiso o no
    *m Android sólo concederá sin preguntar
    */
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        //  Regístrese en Apple / Google para recibir push a través de APNS/FCM
        PushNotifications.register();
      } else {
        // Manejo de errores
        console.error("ERROR> Linea 42 home.page.ts")
      }
    });

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        //alert('Push registration success, token: ' + token.value);
        this.presentAlert(token.value)
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        let origin=JSON.parse(notification.data.inicio);
        console.log('Inicio> ',typeof(origin))//object
        console.log('Inicio> ',typeof(origin.lat))
        let destiny=JSON.parse(notification.data.fin);
        console.log('Fin> ',typeof(destiny.lng))

        let notObjeto = {
          'title':notification.title,
          'inicio':origin,
          'fin':destiny,
          'hora':notification.data.hora,
          'metodoPago':notification.data.metodoPago,
          'valor':notification.data.valor,
        }

        this.shareData.nombreNot$.emit(JSON.stringify(notification));

        this.shareData.notObj$.emit(notObjeto);

        this.shareData.notificacion = notification;
        this.shareData.detalleServicio=notification;
        this.presentAlertConfirm(notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        
        if (notification.notification.data) {
          this.router.navigate(['/tabs'])
          let origin=JSON.parse(notification.notification.data.inicio);
          console.log('Inicio> ',typeof(origin))//object
          console.log('Inicio> ',typeof(origin.lat))
          let destiny=JSON.parse(notification.notification.data.fin);
          console.log('Fin> ',typeof(destiny.lng))

        let notObjeto = {
          'title':notification.notification.title,
          'inicio':origin,
          'fin':destiny,
          'hora':notification.notification.data.hora,
          'metodoPago':notification.notification.data.metodoPago,
          'valor':notification.notification.data.valor,
        }

       
        this.shareData.notificacion=notification;
        this.shareData.detalleServicio=notification;
        this.presentAlertConfirm(notification);
        }
      }
    );
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async presentAlert(identificacion: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registro de Notificaciones',
      subHeader: 'Listo para recibir Peticiones de Servicios!!!',
      message: 'ID> '+identificacion,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm(notification) {
    let title=notification.title;
    let hora=notification.data.hora;
    let metodoPago=notification.data.metodoPago;
    let valor=notification.data.valor;
    let strInicio= await this.detalle.geocodeLatLng(notification.data.inicio);
    let strFin= await this.detalle.geocodeLatLng(notification.data.fin);
    console.log("strINICIO APP COMPONENT"+strInicio);
    console.log("strFIN APP COMPONENT"+strFin);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `${title}`,
      message: `<div id="body-content">
        <p><strong>Pto. de Partida: </strong>${strInicio}</p>
        <p><strong>Pto. de LLegada: </strong>${strFin}</p>
        <p><strong>Hora: </strong>${hora}</p>
        <p><strong>Método de Pago: </strong>${metodoPago}</p>
        <p><strong>Valor: </strong>$${valor}</p>
      </div>`,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'btn-no',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

          }
        }, {
          text: 'SI',
          cssClass: 'btn-si',
          handler: () => {
            console.log('Confirm Okay');
            this.router.navigateByUrl('/detalle');
          }
        }
      ]
    });

    await alert.present();
  }

  on_logout(){
    this.AFauth.logout();
  }

  async presentAlertInicio() {
    const alert = await this.alertController.create({
      cssClass: 'notification-class',
      header: `Inicio del servicio`,
      message: `<div>
     <img class="center" src="assets/icon/proceso_exitoso.png">
     <p>Ha llegado a la ubicación del cliente</p>
    </div>`,
      buttons: [{
        text: 'Iniciar Servicio',
        cssClass: 'btn-si',
        handler: () => {
          console.log('Confirm Okay');
          this.router.navigateByUrl('/detalle');
        }
      }]
    });

    await alert.present();
  }

  async presentAlertFin() {
    const alert = await this.alertController.create({
      cssClass: 'notification-class',
      header: `Fin del servicio`,
      message: `<div>
     <img class="center" src="assets/icon/proceso_exitoso.png">
     <p>Ha llegado a la ubicación del cliente</p>
    </div>`,
      buttons: [{
        text: 'Finalizar Servicio',
        cssClass: 'btn-si',
        handler: () => {
          console.log('Confirm Okay');
          this.router.navigate(['/tabs'])
        }
      }]
    });

    await alert.present();
  }
}
