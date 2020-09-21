import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import{DetalleServicioService} from 'src/app/services/detalle-servicio.service';

import { PopoverController} from '@ionic/angular';
import {PopoverDetalleComponent}from 'src/app/components/popover-detalle/popover-detalle.component';

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
import { PopoverDetalleComponent } from './components/popover-detalle/popover-detalle.component';


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
    private popoverController: PopoverController,
    //private navParams: NavParams,

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
        //this.presentAlertConfirm(notification);
        this.presentPopoverDetalle(notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        
        if (notification.notification.data) {
          let isCompleteRouter = await this.router.navigate(['/tabs'])
          if(isCompleteRouter){
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
          //this.presentAlertConfirm(notification);
          this.presentPopoverDetalle(notification);
          }
          
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

 /* async presentAlertConfirm(notification) {
    let title=notification.title;
    let inicio=notification.data.inicio;
    let fin=notification.data.fin;
    let hora=notification.data.hora;
    let metodoPago=notification.data.metodoPago;
    let valor=notification.data.valor;
    //let strInicio=this.detalleServicio.reverseGeocoding(notification.data.inicio);
    //let strFin=this.detalleServicio.reverseGeocoding(notification.data.fin);
    //console.log("inicioAPP"+strInicio);
    //console.log("finAPP"+strFin);
    //let strInicio=this.detalle.geocodeLatLng(notification.data.inicio);
   // console.log("strInicio"+strInicio);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `<h1 id="header-card">${title}</h1>`,
      message: `<div id="body-content">
        <p><strong>Pto. de Partida: </strong>${inicio}</p>
        <p><strong>Pto. de LLegada: </strong>${fin}</p>
        <p><strong>Hora: </strong>${hora}</p>
        <p><strong>Metodo de Pago: </strong>${metodoPago}</p>
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
  }*/

  on_logout(){
    this.AFauth.logout();
  }

 /* async presentAlertInicio() {
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
  }*/

  /*async presentAlertFin() {
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
/*
  geocodeLatLng(){
//    geocoder:google.maps.Geocoder;
    const latlng={
      lat: -2.148250, lng: -79.965125
    };
    this.geocoder.geocode(
      {location:latlng},
      (results:google.maps.GeocoderResult[],
      status:google.maps.GeocoderStatus
      )=>{
        if(status==="OK"){
          if(results[0]){
            console.log(results[0].formatted_address);
          }
          else{
            console.log("No results found");
          }
        }
        else{
          console.log("Geocoder failed due to: " + status);
        }
      }
    );
  }

 /* async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }*/


  
  async presentPopoverDetalle(notification) {
    let title=notification.title;
    let strInicio= await this.detalle.geocodeLatLng(notification.data.inicio);
    let strFin= await this.detalle.geocodeLatLng(notification.data.fin);
    let hora=notification.data.hora;
    let metodoPago=notification.data.metodoPago;
    let valor=notification.data.valor;

    const popover = await this.popoverController.create({
      component: PopoverDetalleComponent,
      cssClass: 'my-custom-class',
      componentProps:{
         title:title,
         inicio:strInicio,
         fin:strFin,
         hora:hora,
         metodoPago:metodoPago,
         valor: valor
      },
      mode:"md",
      translucent: true
    });
    return await popover.present();
  }
}
