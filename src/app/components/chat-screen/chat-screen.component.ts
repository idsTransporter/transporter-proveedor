import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavParams } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';



@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss'],
})
export class ChatScreenComponent implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  chat:any;
  messages:any[]=[];

  constructor(
    private modal_ctrl: ModalController,
    public chatService: ChatService,
    private nav_params: NavParams,
  ) {
    
   }

  ngOnInit() {
    console.log(this.chat.id)
    this.chatService.getMessages(this.chat.id).subscribe(
      (messages: any[]) => {
        console.log(messages)
        this.messages=messages;
      }
    )
    this.chat=this.nav_params.get('chat');
    
  }

  closeChat(){
    this.modal_ctrl.dismiss()
  }
}
