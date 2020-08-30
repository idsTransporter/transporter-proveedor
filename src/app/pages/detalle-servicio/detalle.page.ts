import { Component, OnInit } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { DetalleServicioService } from '../../services/detalle-servicio.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';

//Servicio para compartir data
import { ShareDataService } from 'src/app/services/share-data.service';
declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})


export class DetallePage implements OnInit {
  map=null;
  onOf=true;

  
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  origin = { lat: -2.140495, lng: -79.906420 };

  destination = { lat: -2.148250, lng: -79.965180 };

  constructor(
    private launchNavigator: LaunchNavigator,
    private detalleServicio:DetalleServicioService,
    private geolocation: Geolocation,
    public shareData: ShareDataService,
    public router:Router,
    ) {
  }

  ngOnInit(){
      this.loadMap();

  } 

    //Funcion para cargar el mapa y dibujar la mejor ruta
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 17,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(indicatorsEle);

  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.calculateRoute();
    });
    
  }

    //Realiza el calculo de la mejor ruta, utiliza los valores de origen y destino| se le debe pasar el modo
    //de viaje que se realiza en este caso DRIVING
  private calculateRoute(){
    console.log(this.shareData.notificacion.data);
    this.directionsService.route({
      origin:this.origin,
      //origin: this.detalleServicio.inicio,
      destination: this.destination,
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
    /*const gps = await this.getLocation();
    const options: LaunchNavigatorOptions = {
      start: [gps.lat,gps.lng],
      app: this.launchNavigator.APP.GOOGLE_MAPS,
    }

    this.launchNavigator.navigate([this.destination.lat,this.destination.lng], options)
      .then(
        success => console.log('Launched navigator', success),
        error => console.log('Error launching navigator', error)
      );*/
      this.router.navigate(['/service-map'])

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