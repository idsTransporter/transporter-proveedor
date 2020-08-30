import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path: 'message',
        loadChildren: '../message/message.module#MessagePageModule'
      },
      {
        path: 'notification',
        loadChildren: '../notification/notification.module#NotificationPageModule'
      },
      {
        path: 'chat',
        loadChildren: '../chat/chat.module#ChatPageModule'
      },
      {
        path: 'map',
        loadChildren: '../map/map.module#MapPageModule'
      }
    ]

    
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
