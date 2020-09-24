import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { stringify } from 'querystring';
declare var google;

@Component({
  selector: 'app-service-map',
  templateUrl: './service-map.page.html',
  styleUrls: ['./service-map.page.scss'],
})
export class ServiceMapPage implements OnInit {
  map=null;

  origin = { lat: -2.183090, lng: -79.901283 };

  destination = { lat: -2.148250, lng: -79.965180 };
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  constructor(
    private geolocation: Geolocation,
  ) { }

  ngOnInit() {
    this.loadMap();
  }


  async loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');
    const myLatLng = await this.getLocation();

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 18,
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
      this.addMaker(myLatLng.lat, myLatLng.lng,"black");
    });
  }

  private calculateRoute(){
    this.directionsService.route({
      origin:this.origin,
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


  private addMaker(lat: number, lng: number,color:string) {
    let url = "http://labs.google.com/ridefinder/images/mm_20_";
    url += color + ".png";
    const marker = new google.maps.Marker({
      position: { lat, lng },
      icon:{
        url:url
      },
      map: this.map,
      title: 'Transporter'
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
