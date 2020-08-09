import { Component, OnInit } from '@angular/core';

//Servicio para la authentication con firebase y el ruteo entre apaginas
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo_electronico: string
  contrasenia: string

  constructor(
    private auth_service: AuthService, 
    public router:Router 
  ) { }

  ngOnInit() {
  }

  on_submit_login(){
    console.log("Dio click al iniciar sesion");
    //Cachar la promise del service/auth
    this.auth_service.login(this.correo_electronico,this.contrasenia)
    .then(//Respuesta positiva
      res => this.router.navigate(['/home'])
    ).catch(
      err => alert("Usuario/cotrasenia incorrectos")
    );
  }

}
