import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';

/**
 * @description
 * Componente login
 * 
 * Componente encargado de la vista de inicio de sesión de la aplicación
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, FooterComponent,  ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [UsuarioService]
})
export class LoginComponent {

  /**
   * Formulario de incio de sesión
   */
  login!: FormGroup;
  /**
   * Lista de usuarios obtenidos desde la variable de sesión
   */
  listaUsuarios: Usuario[] = [];

  /**
   * @constructor
   * @param fb - Servicio de creación de formulario de Angular
   * @param router  - Servicio de enrutamiento de Angular
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   */
  constructor (private usuarioService: UsuarioService, private fb: FormBuilder, private router:Router) {}

  /**
   * Metodo de inicialización del componente
   * Inicializa el formulario de login con sus validaciones correspondiente
   */
  ngOnInit(): void{
    this.login = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasenaUsuario: ['', Validators.required]
    });
    this.obtenerTodosLosUsuarios();
  }

   /**
   * Obtiene todos los usuarios registrados en el JSON REST
   * Una vez obtenidos, llama al metodo verificarSessionUsuario
   */
  obtenerTodosLosUsuarios():void{
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  /**
   * Permite iniciar sesión en la aplicación
   * Verifica si el nombre de usuario y la constraseña corresponde a uno de los valores registrados en en el 
   * servidor
   * 
   * En caso de ser un usuario con el rol de administrador, se redirecciona a la vista admin
   */
  iniciarSesion(){
    if(this.login.valid){
      console.log(this.listaUsuarios);
      const nombreUsuario = this.login.get('nombreUsuario')!.value;
      const contrasena = this.login.get('contrasenaUsuario')!.value;
      if(this.listaUsuarios){
        let usuarioLogeado = false;
        let usuarioActual: Usuario = {} as Usuario;
        this.listaUsuarios.forEach(function (usuario){
          if(usuario.nombreUsuario == nombreUsuario){
            if(usuario.contrasena == contrasena){
              usuario.sesionIniciada = true;  
              usuarioActual = usuario;
              usuarioLogeado = true;
              
            }
          }
        });
        if(usuarioLogeado){
          alert("Sesión iniciada");
          console.log(usuarioActual);
          this.usuarioService.actualizarUsuario(usuarioActual.id, usuarioActual ).subscribe(edit => {
            console.log('Usuario Editado Exitosamente', edit);
            this.obtenerTodosLosUsuarios();  
          }, error => {
            console.error('Ocurrio un error al agregar un usuario:', error);
          });

          if(usuarioActual.rol == 'Administrador'){
            this.router.navigate(['admin/inicio']);
          }else{
            this.router.navigate(['inicio']);
          }

        }else{
          alert("El nombre de usuario o la contraseña es incorrecta");
        }

        // if(nombreUsuario == 'Administrador' && contrasena == '123.pass'){
        //   alert('Sesión como administrador!');
        //   this.router.navigate(['admin/inicio']);
        // }else{
        //   if(usuarioLogeado){
        //     alert('Sesión iniciada!');
        //     sessionStorage.setItem('usuarios', JSON.stringify(this.listaUsuarios));
        //     this.router.navigate(['inicio']);
        //   }else{
        //     alert("El nombre de usuario o la contraseña es incorrecta");
        //   }
        // }

      }else{
        
        alert("El nombre de usuario o la contraseña es incorrecta");
        
      }

    }else{
      alert("Favor de completar los campos obligatorios");
    }
  }
}
