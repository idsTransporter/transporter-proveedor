import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


//Para las push notifications
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed 
} from '@capacitor/core';

const { PushNotifications } = Plugins;

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

  constructor(
    private AFauth: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private shareData: ShareDataService
  ) {
    this.initializeApp();
  }
   
  ngOnInit() {
    console.log('Initializing HomePage');

    /*
    * Solicitar permiso para usar notificaciones push
    * iOS solicitará al usuario y regresará si les concedió permiso o no
    * Android sólo concederá sin preguntar
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
        //alert('Push received: ' + JSON.stringify(notification));
        //notification -> JSON con toda la infor de la not.Push
        /*
        {
          id:''
          data:''
          title:''
          body:''
        }
        */
        //this.shareData.notificacion=JSON.stringify(notification)
        // console.log(typeof(notification))//object
        // console.log(typeof(notification.data))//object
        // console.log(typeof(notification.data.inicio))//string
        // let ini=JSON.parse(notification.data.inicio);
        // console.log('>>>',typeof(ini));//object
        // console.log(ini.lat,typeof ini.lat)//number
        // console.log(ini.lng,typeof ini.lng)//number
        // let fin=JSON.parse(notification.data.fin);
        // console.log('>>>',typeof(fin));//object
        // console.log(fin.lat,typeof fin.lat)//number
        // console.log(fin.lng,typeof fin.lng)//number

        //notificacio.data.inicio llega como String
        //Por eso es necesario castear
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

        this.shareData.notificacion = notification
        this.presentAlertConfirm(notification)
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        this.shareData.notificacion=notification
        this.presentAlertConfirm(notification)
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


    let title=notification.title
    let inicio=notification.data.inicio
    let fin=notification.data.fin
    let hora=notification.data.hora
    let metodoPago=notification.data.metodoPago
    let valor=notification.data.valor

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `${title}`,
      message: `<div>
        <p><strong>Pto. de Partida: </strong>${inicio}</p>
        <p><strong>Pto. de LLegada: </strong>${fin}</p>
        <p><strong>Hora: </strong>${hora}</p>
        <p><strong>Metodo de Pago: </strong>${metodoPago}</p>
        <p><strong>Valor: </strong>$${valor}</p>
      </div>`,
      buttons: [
        {
          text: 'Omitir',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  on_logout(){
    this.AFauth.logout();
  }

}
