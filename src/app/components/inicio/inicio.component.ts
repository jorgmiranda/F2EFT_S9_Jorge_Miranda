import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation,  HostListener, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';

/**
 * @description
 * Componente inicio
 * 
 * Es la primera pagina de sistema y todavia se encuentra en construcción, para esta demo 
 * se muestra el nombre de usuario logeado
 */
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  providers: [UsuarioService]
})
export class InicioComponent implements OnInit{

  /**
   * instancia de arreglo de productos
   */
  listaProductos: any[] = [];
  /**
   * Instancia de arreglo de usuarios
   */
  listaUsuarios: any[] = [];
  /**
   * Instancia de usuario utilizando la interface Usuario
   */
  usuariologeado?: Usuario;
  /**
   * Flag de usuario logeado
   */
  sesionIniciada: boolean = false;
  /**
   * @constructor
   * @param platformId - Identificado de la plataforma (Navegador o Servidor)
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private usuarioService: UsuarioService) { }

  /**
   * Metodo de inicialización del componente
   * Se inicializan las lista de productos/usuarios guardados en sesión.
   * Inicializa la funcionalidad del carrito permitiendo su uso en esta pagina.
   * Inicialia la lista de Usuarios
   */
  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
    if (isPlatformBrowser(this.platformId)) {
      this.listaProductos = JSON.parse(sessionStorage.getItem('listaProductos') || '[]');
      //this.listaUsuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');
      this.funcionalidadCarrito();
      
     
      
    }
  }
  /**
   * Funcionalidad de eliminar items del carrito en esta pagina
   */
  private funcionalidadCarrito(): void {
    const cartInfo = document.querySelector('.cart-product') as HTMLElement | null;
    const rowProduct = document.querySelector('.row-product') as HTMLElement | null;
    const productList = document.querySelector('.card-container') as HTMLElement | null;
    const valorTotal = document.querySelector('#total-pagar') as HTMLElement | null;
    const contarProductos = document.querySelector('#contador-productos') as HTMLElement | null;
    const cartEmpty = document.querySelector('.cart-empty') as HTMLElement | null;
    const cartTotal = document.querySelector('.cart-total') as HTMLElement | null;

    if (rowProduct  && valorTotal && contarProductos && cartEmpty && cartTotal) {
      rowProduct.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('icon-close')) {
          const producto = (e.target as HTMLElement).parentElement as HTMLElement;
          const titulo = (producto.querySelector('p') as HTMLElement).textContent || '';

          this.listaProductos = this.listaProductos.filter(
            producto => producto.titulo !== titulo
          );

          sessionStorage.setItem('listaProductos', JSON.stringify(this.listaProductos));
          this.showHtml(rowProduct, valorTotal, contarProductos, cartEmpty, cartTotal);
          console.log(this.listaProductos);
        }
      });
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
   * Verifica si el usuario esta logeado en el sistema
   */
  private verificarUsuario(){
    this.listaUsuarios.forEach((usuario) => {
      if (usuario.sesionIniciada) {
        this.usuariologeado = usuario;
        
        this.sesionIniciada = true;

      }
    });
  
  }

  /**
   * Consume el servicio REST para obtener todos los usuarios del sistema
   * Una vez inicialidad la lista se invoca el metodo verificarUsuario
   * que se encarga de identificar el usuario logeado.
   */
  obtenerTodosLosUsuarios():void{
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(data => {
      this.listaUsuarios = data;
      this.verificarUsuario();
    });
  }
}

/**
 * Formatea un numero con el formato de peso chileno
 * @param x 
 * @returns 
 */
function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

