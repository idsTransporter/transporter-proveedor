import { Component, OnInit} from '@angular/core';
import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-popover-inicio-fin',
  templateUrl: './popover-inicio-fin.component.html',
  styleUrls: ['./popover-inicio-fin.component.scss'],
})
export class PopoverInicioFinComponent implements OnInit {
  title;
  body;
  btn;

  constructor(private navParams: NavParams) {
    this.title=this.navParams.get("title");
    this.body=this.navParams.get("body");
    this.btn=this.navParams.get("btn");
   }

  ngOnInit() {}

}
