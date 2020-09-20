import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popover-detalle',
  templateUrl: './popover-detalle.component.html',
  styleUrls: ['./popover-detalle.component.scss'],
})
export class PopoverDetalleComponent implements OnInit {
  title;
  inicio;
  fin;
  hora;
  metodo;
  valor;
  watch:any;

  constructor(private router: Router,private navParams: NavParams,private popover:PopoverController) {
    this.title=this.navParams.get("title");
    this.inicio=this.navParams.get("inicio");
    this.fin=this.navParams.get("fin");
    this.hora=this.navParams.get("hora");
    this.metodo=this.navParams.get("metodoPago");
    this.valor=this.navParams.get("valor");
   }

  ngOnInit() {}

  private bloquearInicio(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = true;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = false;
  }

  private bloquearFin(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = false;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = true;
  }

  private stopWatch(){
    this.watch=null;
  }


  iniciarServicio(){
    console.log('CONFIRM ACEPTAR');
    this.bloquearInicio();
    this.popover.dismiss();
        
  }

  finalizarServicio(){
    console.log('CARRERA FINALIZADA');
          this.stopWatch();
          //this.detalle.geocodeLatLng();          
          this.bloquearFin();
          this.router.navigateByUrl('/pago');
          this.popover.dismiss();
  }
}
