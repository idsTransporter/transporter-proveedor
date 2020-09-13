import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { DetalleServicioService } from '../../services/detalle-servicio.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';

//Servicio para compartir data
import { ShareDataService } from 'src/app/services/share-data.service';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})


export class DetallePage implements OnInit,OnDestroy {
  mapa=null;
  marker=null;
  watch:any;

  
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  origin = { lat: -2.148250, lng: -79.965125 };

  destination = { lat: -2.148250, lng: -79.965180 };

  nombreNot: string ="";
  nombreNotSubs: Subscription;


  notObj: object={};
  notObjSub: Subscription;

  constructor(
    private geolocation: Geolocation,
    public alertController: AlertController,
    public shareData: ShareDataService,
    private router: Router,
    ) {
  }
  ngOnDestroy(){
    console.log("*** DESTROY DETALLESS")
    //this.nombreNotSubs.unsubscribe();
    //this.notObjSub.unsubscribe();
   //this.mapa=null;
    //this.watch=null;
  }
  /*ionViewWillLeave(){
    this.watchPosition();
  }*/

  ionViewWillEnter(){
    this.loadMap();
    this.watchPosition();
  }


  ngOnInit(){
  //  this.loadMap();
    //this.watchPosition();
  } 

    //Funcion para cargar el mapa y dibujar la mejor ruta
  async loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('mapa');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');

    // create map
    this.mapa = await new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 17,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    await this.directionsDisplay.setMap(this.mapa);
    await google.maps.event.addListenerOnce(this.mapa, 'idle', () => {
      this.origin=this.shareData.notificacion.data.inicio;
      this.destination=this.shareData.notificacion.data.fin;
      mapEle.classList.add('show-map');
      this.calculateRoute(this.origin,this.destination);
    });    
  }

    //Realiza el calculo de la mejor ruta, utiliza los valores de origen y destino| se le debe pasar el modo
    //de viaje que se realiza en este caso DRIVING
  private calculateRoute(ini:any,fin:any){  
    this.directionsService.route({
      origin: JSON.parse(ini) ,
      destination: JSON.parse(fin),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('No se pudo cargar el mapa ' + status);
      }
    });
  }
  
  private watchPosition(){
    this.watch= this.geolocation.watchPosition();
    this.watch.subscribe((data)=>{
      if(this.marker!=null){
        this.marker.setMap(null);
        console.log("entro");
      }
      if ("coords" in data){
        let lat=data.coords.latitude;
        let lng=data.coords.longitude;
        console.log("latitud "+ lat);
        console.log("longitud "+ lng);
        let latLng=new google.maps.LatLng(lat,lng);
        this.marker = new google.maps.Marker({
          map: this.mapa,
          icon: new google.maps.MarkerImage('https://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
          new google.maps.Size(22, 22),
          new google.maps.Point(0, 18),
          new google.maps.Point(11, 11)),
          position: latLng      
        });
      }
      else {
        console.log("ERROR WATCH POSITION");
      }
    })
  } 
  async confirmarServicio() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Desea iniciar el servicio?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('CONFIRM ACEPTAR');
            this.bloquearInicio();
          }
        }, {
          text: 'Cancelar',
          role:'cancel'
        }
      ]
    });

    await alert.present();
  }

  private bloquearInicio(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = true;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = false;
  }

  async finalizarServicio() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Desea finalizar el servicio?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('CARRERA FINALIZADA');
            this.stopWatch();
            this.router.navigate(['/map']);
          }
        }, {
          text: 'Cancelar',
          role:'cancel'
        }
      ]
    });

    await alert.present();
  }

  private stopWatch(){
    this.watch=null;
  }

}