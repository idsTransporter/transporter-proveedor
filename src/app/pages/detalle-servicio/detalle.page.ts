import { Component, OnInit } from '@angular/core';
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

  constructor() {
  }

  ngOnInit(){
      this.toggleValue;
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
      zoom: 12,
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
  
  //Incompleto |Para toggle
  toggleValue(event):void{
    const isChecked: HTMLElement = document.getElementById('toggle');
    const value=isChecked.getAttribute("aria-checked");
    console.log(value);
  }

}