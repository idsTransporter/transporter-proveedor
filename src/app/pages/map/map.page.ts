import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})


export class MapPage implements OnInit {
  map = null;
  status=false;

  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController
  ) {

  }

  ngOnInit() {
    this.loadMap();
  }

  //Cargar el mapa, llama a la funcion getLocation para obtener longitud y latitud del usuario y los pasa 
  //para renderizar el mapa utilizando la variable map(Valores y detalles del mapa)
  async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    const myLatLng = await this.getLocation();
    const mapEle: HTMLElement = document.getElementById('map');
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 17,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    google.maps.event
    .addListenerOnce(this.map, 'idle', () => {
      loading.dismiss();
        this.addMaker(myLatLng.lat, myLatLng.lng);
    });
  }

  //Agrega un marcador al punto que se le pasa y lo dibuja en el mapa, recibe los paramatros de latitud y longitud
  private addMaker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Transporter'
    });
  }


  //Funcion para obtener la localizacion, devuelve dos valores (latitud y longitud)
  private async getLocation() {
    const myPosition = await this.geolocation.getCurrentPosition();
    console.log("Latitud :"+myPosition.coords.latitude+"Longitud :"+myPosition.coords.longitude);

    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    };
  }

}