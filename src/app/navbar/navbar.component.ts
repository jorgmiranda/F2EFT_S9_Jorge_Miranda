import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../model/usuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';

/**
 * @description
 * Componente de encabezado, barra de navegación y inicialización de carrito de compras
 * 
 * Este componentne muestra el encabezado, barra de navegación y el carrito de compras para los usuarios consumidores.
 * Este habilita el uso del carrito de compras en multiples paginas y controla la barra de navegación para que cambie si el usuario
 * inicio sesión en el sistema.
 */
/**
 * @usageNotes
 * 1. Importa este componente en los compoentes relacionados a la vista del usuario
 * 2. Añade el selector ´app-navbar´ para mostrar el encabezado
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [UsuarioService]
})
export class NavbarComponent implements OnInit {
  /**
   * instancia de arreglo de productos
   */
  listaProductos: any[] = [];
  /**
   * Instancia de arreglo de lista de usuarios
   */
  listaUsuarios: any[] = [];
  /**
   * Flag de sesión iniciada
   */
  sesionIniciada: boolean = false;
  /**
   * Instancia de usuario utilizando la interface Usuario
   */
  usuariologeado?: Usuario;
  /**
   * @constructor
   * @param platformId - Identificado de la plataforma (Navegador o Servidor)
   * @param router - Servicio de enrutamiento de Angular
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router:Router, private usuarioService: UsuarioService) { }


  /**
   * Metodo de inicialización del componente
   * Configura el carrito de compras en la barra de navegación y verifica la sesión del usuario
   */
  ngOnInit(): void {
    // Permite determinar que el codigo se ejecute en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarCarrito();
      this.listaProductos = JSON.parse(sessionStorage.getItem('listaProductos') || '[]');
      //this.listaUsuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');
      this.instanciarShowHMTL();
      this.obtenerTodosLosUsuarios();

    }
  }
  
  /**
   * Configura la visualización del carrito de compras en el navbar
   * Muestra y oculta el carrito al hacer click en el boton correspondiente.
   */
  private inicializarCarrito(): void {
    //Configuración del btn Para mostrar el carrito de compras
    const btnCart = document.querySelector('.container-cart-icon') as HTMLElement | null;
    const containerCartProducts = document.querySelector('.container-cart-products') as HTMLElement | null;

    if (btnCart && containerCartProducts) { // Comprobación de null
      btnCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
      });
    }
  }

  /**
   * Configuración que permite visualizar los items en el carrito
   */
  private instanciarShowHMTL() {
    const rowProduct = document.querySelector('.row-product') as HTMLElement | null;
    const valorTotal = document.querySelector('#total-pagar') as HTMLElement | null;
    const contarProductos = document.querySelector('#contador-productos') as HTMLElement | null;
    const cartEmpty = document.querySelector('.cart-empty') as HTMLElement | null;
    const cartTotal = document.querySelector('.cart-total') as HTMLElement | null;
    if (rowProduct && valorTotal && contarProductos && cartEmpty && cartTotal) {
      this.showHtml(rowProduct, valorTotal, contarProductos, cartEmpty, cartTotal);
    }


  }

  /**
   * Metodo utilizado para la generación de html en el carrito basado en la lista de productos almacenada en sesión
   * 
   * @param rowProduct - Elemento contenedor de los productos en el carrtio
   * @param valorTotal - Elemento que muestra el total a pagar
   * @param contarProductos - Elemento qure muestra la cantidad de productos en el carrito
   * @param cartEmpty - Elemento que muestra el mensaje de carrito vacio
   * @param cartTotal - Elemento que muestra el contenedor del valor total del carrito
   */
  private showHtml(
    rowProduct: HTMLElement,
    valorTotal: HTMLElement,
    contarProductos: HTMLElement,
    cartEmpty: HTMLElement,
    cartTotal: HTMLElement
  ): void {
    if (!this.listaProductos.length) {
      cartEmpty.classList.remove('hidden');
      rowProduct.classList.add('hidden');
      cartTotal.classList.add('hidden');
    } else {
      cartEmpty.classList.add('hidden');
      rowProduct.classList.remove('hidden');
      cartTotal.classList.remove('hidden');
    }

    // Limpiar HTML
    rowProduct.innerHTML = '';

    let total = 0;
    let totalProductos = 0;

    this.listaProductos.forEach(producto => {
      const containerProduct = document.createElement('div');
      containerProduct.classList.add('cart-product');

      containerProduct.innerHTML = `
        <div class="info-cart-product">
          <span class="cantidad-producto-carrito">${producto.cantidad}</span>
          <p class="titulo-producto-carrito">${producto.titulo}</p>
          <span class="precio-producto-carrito">${producto.precio}</span>
        </div>
        <svg width="40" height="40" viewBox="0 0 40 40" class="icon-close">
          <path d="M 10,10 L 30,30 M 30,10 L 10,30" stroke="black" stroke-width="4" />
        </svg>
      `;

      rowProduct.append(containerProduct);

      total += producto.cantidad * parseInt(producto.precio.replace('.', '').replace('$', ''));
      totalProductos += producto.cantidad;
    });

    valorTotal.innerText = `$${numberWithCommas(total)}`;
    contarProductos.innerText = totalProductos.toString();

  }


  /**
   * Verifica si  algún usuario tiene la sesión iniciada
   */
  verificarSesionUsuario(): void {
    if (this.listaUsuarios) {
      this.listaUsuarios.forEach((usuario) => {
        if (usuario.sesionIniciada) {
          this.sesionIniciada = true;
          this.usuariologeado = usuario;
        }
      });
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
   * Cierra la sesión del usuario logeado
   */
  cerrarSesion():void{
    if(this.usuariologeado){
      this.usuariologeado.sesionIniciada = false;
      this.usuarioService.actualizarUsuario(this.usuariologeado.id, this.usuariologeado ).subscribe(edit => {
        console.log('Usuario Editado Exitosamente', edit);
        this.obtenerTodosLosUsuarios();  
      }, error => {
        console.error('Ocurrio un error al agregar un usuario:', error);
      });
      this.sesionIniciada = false;
      this.usuariologeado = undefined;
      //alert("Sesion Cerrada");
      this.router.navigate(['/inicio']);
    }
  }
}
/**
 * Formatea un numero con el formato de peso chileno
 * 
 * @param x 
 * @returns 
 */
function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


