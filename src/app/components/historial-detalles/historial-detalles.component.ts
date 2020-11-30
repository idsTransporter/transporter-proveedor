import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-detalles',
  templateUrl: './historial-detalles.component.html',
  styleUrls: ['./historial-detalles.component.scss'],
})

export class HistorialDetallesComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  closeModal(){
    this.modalCtrl.dismiss();
  }
}
