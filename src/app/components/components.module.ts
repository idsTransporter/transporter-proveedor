import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBackComponent } from './header-back/header-back.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    HeaderBackComponent,
  ],
  exports:[
    HeaderBackComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule { }
