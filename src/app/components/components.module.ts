import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBackComponent } from './header-back/header-back.component';
import { IonicModule } from '@ionic/angular';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { FormsModule } from '@angular/forms';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { RatingComponent } from './rating/rating.component';
import { HistorialDetallesComponent } from './historial-detalles/historial-detalles.component';



@NgModule({
  declarations: [
    HeaderBackComponent,
    ChatScreenComponent,
    TerminosCondicionesComponent,
    RatingComponent,
    HistorialDetallesComponent,
  ],
  exports:[
    HeaderBackComponent,
    ChatScreenComponent,
    TerminosCondicionesComponent,
    RatingComponent,
    HistorialDetallesComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class ComponentsModule { }
