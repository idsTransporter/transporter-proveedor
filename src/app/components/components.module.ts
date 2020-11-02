import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBackComponent } from './header-back/header-back.component';
import { IonicModule } from '@ionic/angular';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';



@NgModule({
  declarations: [
    HeaderBackComponent,
    ChatScreenComponent,
  ],
  exports:[
    HeaderBackComponent,
    ChatScreenComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule { }
