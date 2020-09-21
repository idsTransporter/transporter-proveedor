import { Injectable } from '@angular/core';

//Loader
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    public loadingController: LoadingController,
  ) { }

  // showHideAutoLoader() {

  //   this.loadingController.create({
  //     message: 'This Loader Will Auto Hide in 2 Seconds',
  //     duration: 2000
  //   }).then((res) => {
  //     res.present();

  //     res.onDidDismiss().then((dis) => {
  //       console.log('Loading dismissed! after 2 Seconds', dis);
  //     });
  //   });

  // }
  async showHideAutoLoader() {

    const loading = await this.loadingController.create({
      message: 'This Loader Will Auto Hide in 2 Seconds',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed! after 2 Seconds', { role, data });

  }

  // Show the loader for infinite time
  showLoader() {

    this.loadingController.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });

  }

  // Hide the loader if already created otherwise return error
  hideLoader() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }

}
