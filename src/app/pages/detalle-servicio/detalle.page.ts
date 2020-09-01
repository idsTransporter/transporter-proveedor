import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { DetalleServicioService } from '../../services/detalle-servicio.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

//Servicio para compartir data
import { ShareDataService } from 'src/app/services/share-data.service';
import { Subscription } from 'rxjs';

import { AlertController } from '@ionic/angular';

import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})


export class DetallePage implements OnInit,OnDestroy {
  map=null;
  onOf=true;

  
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  origin = { lat: -2.148250, lng: -79.965125 };

  destination = { lat: -2.148250, lng: -79.965180 };

  nombreNot: string ="";
  nombreNotSubs: Subscription;


  notObj: object={};
  notObjSub: Subscription;

  constructor(
    private launchNavigator: LaunchNavigator,
    private detalleServicio:DetalleServicioService,
    private geolocation: Geolocation,
    public alertController: AlertController,
    public shareData: ShareDataService,
    private router: Router
    ) {
  }
  ngOnDestroy(){
    console.log("*** DESTROY DETALLESS")
    this.nombreNotSubs.unsubscribe();
    this.notObjSub.unsubscribe();
  }

  ionViewWillEnter(){
    console.log("ionViewDidEnter")
    
}
  ngOnInit(){

    this.loadMap();

  } 

    //Funcion para cargar el mapa y dibujar la mejor ruta
  async loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('mapa');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');

    // create map
    this.map = await new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 17,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    await this.directionsDisplay.setMap(this.map);
    await google.maps.event.addListenerOnce(this.map, 'idle', () => {
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
  
   async getnavigations() {
    const gps = await this.getLocation();
    const options: LaunchNavigatorOptions = {
      start: [gps.lat,gps.lng],
      app: this.launchNavigator.APP.GOOGLE_MAPS,
    }

    this.launchNavigator.navigate([this.destination.lat,this.destination.lng], options)
      .then(
        success => console.log('Launched navigator', success),
        error => console.log('Error launching navigator', error)
      );
  }



  private async getLocation() {
    const myPosition = await this.geolocation.getCurrentPosition();
    console.log("Latitud :"+myPosition.coords.latitude+"Longitud :"+myPosition.coords.longitude);

    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    };
  }



}

