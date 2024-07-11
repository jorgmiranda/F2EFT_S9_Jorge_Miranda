import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms'; 

/**
 * @description
 * Componente Recuperción de contraseña
 * 
 * Este componente le permite ingresar el correo al usuario, y si este esta registrado obtiene la contraseña
 */
@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent {
  /**
   * Formulario de recuperación de contraseña
   */
  recuperarCorreo!: FormGroup;
  /**
   * Instancia de arreglo de usuarios
   */
  listaUsuarios: any[] = [];

  /**
   * @constructor
   * @param fb - Servicio de creación de formulario de Angular
   */
  constructor (private fb: FormBuilder) {}

  /**
   * Metodo de inicialización del componente.
   * Inicializa el formulario de recpuerar contraseña y obtiene el listado de usuarios registrados en el sesión storage
   */
  ngOnInit(): void{
    this.recuperarCorreo = this.fb.group({
      correoValidacion: ['', [Validators.required, Validators.email]]
    });
    this.listaUsuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');
  }

  /**
   * Permite recueprar la contraseña del usuario
   * Recupera la contraseña del usuario, si el correo esta registrado en la variable de sesión.
   */
  recuperarContrasena(){
    if(this.recuperarCorreo.valid){
      const correo = this.recuperarCorreo.get('correoValidacion')!.value;
      let contrasenaEncontrada = '';
      if(this.listaUsuarios){
        this.listaUsuarios.forEach(function (usuario) {
          if (usuario.correo == correo) {
            contrasenaEncontrada = usuario.contrasena;
          }
      });
      if(contrasenaEncontrada != ''){
          alert('Su Contraseña es: '+ contrasenaEncontrada);
      }else{
          alert('El correo ingresado no existe');
      }

      }else{
        alert('El correo ingresado no existe');
      }
    }
  }

}
