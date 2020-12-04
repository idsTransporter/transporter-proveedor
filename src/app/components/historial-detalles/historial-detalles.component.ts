import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DetalleServicioService } from 'src/app/services/detalle-servicio.service';

@Component({
  selector: 'app-historial-detalles',
  templateUrl: './historial-detalles.component.html',
  styleUrls: ['./historial-detalles.component.scss'],
})

export class HistorialDetallesComponent implements OnInit {

  // Data passed in by componentProps
  @Input() information: any;
  public inicio;
  public fin;

  map = null;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  origin = { lat: -2.148250, lng: -79.965125 };
  destination = { lat: -2.148250, lng: -79.965180 };

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private detalleService: DetalleServicioService,
  ) { }

  ngOnInit() {
    this.loadDirections();
  }

  private async loadDirections() {
    this.inicio = await this.detalleService.geocodeLatLng(this.information.inicio);
    this.fin = await this.detalleService.geocodeLatLng(this.information.fin);
  }

  ionViewWillEnter() {
    const mapEle: HTMLElement = document.getElementById('mapHD');
    this.loadMap(mapEle);
  }

  async loadMap(mapEle) {

    const loading = await this.loadingCtrl.create();
    loading.present();
    const myLatLng = await this.getLocation();

    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 17,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    await this.directionsDisplay.setMap(this.map);
    await google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.origin = this.information.inicio;
      this.destination = this.information.fin;
      mapEle.classList.add('show-map');
      this.calculateRoute(this.origin, this.destination);
    });
    google.maps.event
      .addListenerOnce(this.map, 'idle', () => {
        loading.dismiss();
        this.addMaker(myLatLng.lat, myLatLng.lng);
      })
  }

  //Realiza el calculo de la mejor ruta, utiliza los valores de origen y destino| se le debe pasar el modo
  //de viaje que se realiza en este caso DRIVING
  private calculateRoute(ini: any, fin: any) {
    this.directionsService.route({
      origin: JSON.parse(ini),
      destination: JSON.parse(fin),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('No se pudo cargar el mapa ' + status);
      }
    });
  }

  private async getLocation() {
    const myPosition = await this.geolocation.getCurrentPosition();
    console.log("Historial-detalles> Latitud :" + myPosition.coords.latitude + "Longitud :" + myPosition.coords.longitude);

    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    };
  }

  //Agrega un marcador al punto que se le pasa y lo dibuja en el mapa, recibe los paramatros de latitud y longitud
  private addMaker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Transporter'
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
