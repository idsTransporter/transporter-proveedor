import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HistorialDetallesComponent } from 'src/app/components/historial-detalles/historial-detalles.component';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  
  isFinished:boolean = true;

  items: any[] = [];

  lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
  ];

  rotateImg = 0;

  constructor(
    private modalCtrl:ModalController,
    private storage: StorageService,
  ) {
    for (let i = 0; i < 1000; i++) {
      this.items.push({
        name: i + ' - ' + this.images[this.rotateImg],
        imgSrc: this.getImgSrc(),
        avatarSrc: this.getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        content: this.lorem.substring(0, Math.random() * (this.lorem.length - 100) + 100)
      });

      this.rotateImg++;
      if (this.rotateImg === this.images.length) {
        this.rotateImg = 0;
      }
    }
  }



  getImgSrc() {
    const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
    this.rotateImg++;
    if (this.rotateImg === this.images.length) {
      this.rotateImg = 0;
    }
    return src;
  }




  ngOnInit() {
  }

  async presentModal() {



    this.storage.getObject();//Sacado del Storage
    
    let dataService = {};
    
    
    const modal = await this.modalCtrl.create({
      component: HistorialDetallesComponent,
      componentProps: {
        'information': dataService,
      },
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

}
