import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';

/**
 * @description
 * Componente de encabezado y barra de navegación para la sección de administración
 * 
 * Este componentne muestra el encabezado y barra de navegación para los usuarios administradores.
 *
 * @usageNotes
 * 1. Importa este componente en los compoentes relacionados a la vista del administrador
 * 2. Añade el selector ´app-navbaradmin para mostrar el encabezado
 */
@Component({
  selector: 'app-navbaradmin',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbaradmin.component.html',
  styleUrl: './navbaradmin.component.scss',
  providers: [UsuarioService]
})
/**
 * Navbar Admin component
 */
export class NavbaradminComponent implements OnInit{

    /**
   * Instancia de usuario utilizando la interface Usuario
   */
    usuariologeado?: Usuario;

  /**
   * Instancia de arreglo de lista de usuarios
   */
  listaUsuarios: Usuario[] = [];

  /**
   * 
   * @param platformId - Identificado de la plataforma (Navegador o Servidor)
   * @param router - Servicio de enrutamiento de Angular
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router:Router, private usuarioService: UsuarioService) { }

   /**
   * Metodo de inicialización del componente
   * Inicializa la barra de navegación para obtener el usuario que tiene la sesión iniciada
   */
  ngOnInit(): void {
    // Permite determinar que el codigo se ejecute en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerTodosLosUsuarios();

    }
  }

  /**
   * Obtiene todos los usuarios registrados en el JSON REST
   * Una vez obtenidos, llama al metodo verificarSessionUsuario
   */
  obtenerTodosLosUsuarios():void{
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(data => {
      this.listaUsuarios = data;
      this.verificarSesionUsuario();
    });
  }
  
  /**
   * Verifica que usuario tiene la bandera sesionIniciada como true
   * y lo recupera para usarlo en el modulo
   */
  verificarSesionUsuario(): void {
    if (this.listaUsuarios) {
      this.listaUsuarios.forEach((usuario) => {
        if (usuario.sesionIniciada) {
          this.usuariologeado = usuario;
        }
      });
    }
  }

  /**
   * Cierra la sesión del administrador y regresa a la pagina de inicio
   */
  apagarSesionAdmin(){
    if(this.usuariologeado){
      this.usuariologeado.sesionIniciada = false;
      this.usuarioService.actualizarUsuario(this.usuariologeado.id, this.usuariologeado ).subscribe(edit => {
        console.log('Usuario Editado Exitosamente', edit);
        this.obtenerTodosLosUsuarios();  
      }, error => {
        console.error('Ocurrio un error al agregar un usuario:', error);
      });
      this.usuariologeado = undefined;
      alert("Sesion Cerrada");
      this.router.navigate(['inicio']);
    }
  }

}
