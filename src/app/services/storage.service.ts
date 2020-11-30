import { Injectable } from '@angular/core';

//Storage
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setUserInformation(user){
    if(user){
      console.log("Logueado el user> "+user.uid);
      await Storage.set({
        key: user.uid,
        value: JSON.stringify(user),
      });
    }else{
      console.error("No esta logueado.");
    }
  }

  async getUserInformation(user_uid){
    const ret = await Storage.get({ key: user_uid });
    const user = JSON.parse(ret.value);
    console.log("Sacado del Storage> " + user);
  }

  // JSON "set" example
  async setObject() {
    await Storage.set({
      key: 'user',
      value: JSON.stringify({
        id: 1,
        name: 'Max'
      })
    });

    console.error("SET");

  }

  // JSON "get" example
  async getObject() {
    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value);
    console.log("Sacado del Storage> " + user);
    console.error("GET");
  }

  async setItem() {
    await Storage.set({
      key: 'name',
      value: 'Max'
    });
  }

  async getItem() {
    const { value } = await Storage.get({ key: 'name' });
    console.log('Got item: ', value);
  }

  async removeItem() {
    await Storage.remove({ key: 'name' });
  }

  async keys() {
    const { keys } = await Storage.keys();
    console.log('Got keys: ', keys);
  }

  async clear() {
    await Storage.clear();
  }
}
