import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-historial-detalles',
  templateUrl: './historial-detalles.component.html',
  styleUrls: ['./historial-detalles.component.scss'],
})

export class HistorialDetallesComponent implements OnInit {

  // Data passed in by componentProps
  @Input() information: object;

  map = null;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){
    const mapEle: HTMLElement = document.getElementById('mapHD');
    this.loadMap(mapEle);
   }

  async loadMap(mapEle){
    
    const loading = await this.loadingCtrl.create();
    loading.present();
    const myLatLng = await this.getLocation();
    
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
    })
  }

  private async getLocation(){
    const myPosition = await this.geolocation.getCurrentPosition();
    console.log("Historial-detalles> Latitud :"+myPosition.coords.latitude+"Longitud :"+myPosition.coords.longitude);

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

  closeModal(){
    this.modalCtrl.dismiss();
  }
}
