import { Component, OnInit } from '@angular/core';

import { AuthService } from "../services/auth.service";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  notificaciones: any []=Array(20); 
  constructor(
    private AFauth: AuthService
  ) {}
  
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  on_logout(){
    this.AFauth.logout();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.notificaciones.length == 20) {
        event.target.disabled = true;
      }
    }, 50);
  }
}
