import { Component, OnInit, OnDestroy } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { DetalleServicioService } from '../../services/detalle-servicio.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

//Servicio para compartir data
import { ShareDataService } from 'src/app/services/share-data.service';
import { Subscription } from 'rxjs';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})


export class DetallePage implements OnInit,OnDestroy {
  map=null;
  onOf=true;

  
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  origin = { lat: -2.140495, lng: -79.906420 };

  destination = { lat: -2.148250, lng: -79.965180 };

  nombreNot: string ="";
  nombreNotSubs: Subscription;


  notObj: object={};
  notObjSub: Subscription;

  constructor(
    private launchNavigator: LaunchNavigator,
    private detalleServicio:DetalleServicioService,
    private geolocation: Geolocation,
    public shareData: ShareDataService
    ) {
  }
  ngOnDestroy(){
    console.log("*** DESTROY DETALLESS")
    this.nombreNotSubs.unsubscribe();
    this.notObjSub.unsubscribe();
  }

  ngOnInit(){
    this.nombreNotSubs=this.shareData.nombreNot$.subscribe(
      noti => {
        this.nombreNot=noti
        console.log('*****',noti,typeof(noti));
        //console.log('*****',noti,typeof(noti.data.inicio));

      }
    );

    this.notObjSub=this.shareData.notObj$.subscribe(
      notificacionObj => {
        console.log('>>>>> ',notificacionObj);
        this.notObj=notificacionObj;
      }
    );
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
    this.directionsService.route({
      origin: this.origin,
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

  getTask() {
    this.detalleServicio.getTask('1')
    .subscribe(detalle => {
      console.log(detalle);
      (<HTMLInputElement>document.getElementById('name')).value=detalle.name;
      (<HTMLInputElement>document.getElementById('hora')).value=detalle.id;
      (<HTMLInputElement>document.getElementById('precio')).value=detalle.phone;
    });
  }

  updateTask() {
    const task = {
      id:'1',
      name:'lala',
      hora:'po',
      precio:'na',
      email:'lalala@gmail.com',
      phone:'1234',
      username:"transportista"
    };
    this.detalleServicio.updateTask(task)
    .subscribe(todo => {
      console.log(todo);
    });
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