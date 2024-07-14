import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Producto } from '../../model/producto';
import { ProductoService } from '../../services/prodcuto.service';

/**
 * @description
 * Componente Productos
 * 
 * Este componente es el encargado de cargar los productos disponibles en el sistema dependiendo de la sección ingresada.
 * 
 * 
 */
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ProductoService]
})
export class ProductosComponent implements OnInit {
  /**
   * Variable sección para definir que productos se mostraran
   */
  seccion: string = '';
  /**
   * Instancia de lista de productos
   */
  listaProductos: any[] = [];
  /**
   * Instancia que almacenara los productos recuperados del servicio
   */
  productos: Producto[] = [];
  /**
   * @constructor
   * @param platformId - Identificado de la plataforma (Navegador o Servidor)
   * @param route - Servicio de enrutamiento de Angular
   * @param elRef - Referencia al elemento del DOM asociado con este componente.
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute, private elRef: ElementRef
  , private productoService: ProductoService) { }

  /**
   * Metodo de inicialización del componente
   * suscribiéndose a los parámetros de la ruta y configurando la funcionalidad del carrito de compras.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.seccion = params.get('seccion') || '';
      this.inicializarProductos();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.listaProductos = JSON.parse(sessionStorage.getItem('listaProductos') || '[]');
      this.funcionalidadCarrito();

    }
  }

  /**
   * Inicializa la lista de productos basada en la sección actual.
   */
  inicializarProductos(){
    this.productoService.obtenerProductosPorTipo(this.seccion).subscribe(data => {
      this.productos = data;
    });
  }

  /**
   * Maneja los eventos de clic en el documento. Agrega productos al carrito y actualiza la vista del carrito.
   * 
   * @param event - El evento de clic del ratón.
   */
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const productList = this.elRef.nativeElement.querySelector('.card-container');
    const rowProduct = this.elRef.nativeElement.querySelector('.row-product');
    const valorTotal = this.elRef.nativeElement.querySelector('#total-pagar');
    const contarProductos = this.elRef.nativeElement.querySelector('#contador-productos');
    const cartEmpty = this.elRef.nativeElement.querySelector('.cart-empty');
    const cartTotal = this.elRef.nativeElement.querySelector('.cart-total');

    if (productList && event.target instanceof HTMLElement && event.target.classList.contains('btn-add-cart')) {
      const producto = event.target.parentElement as HTMLElement;
      const infoProducto = {
        cantidad: 1,
        titulo: producto.querySelector('h5')?.textContent || '',
        precio: producto.querySelector('.precio')?.textContent?.replace('Precio: ', '') || ''
      };

      const exists = this.listaProductos.some(producto => producto.titulo === infoProducto.titulo);
      if (exists) {
        const productos = this.listaProductos.map(producto => {
          if (producto.titulo === infoProducto.titulo) {
            producto.cantidad++;
          }
          return producto;
        });
        this.listaProductos = [...productos];
      } else {
        this.listaProductos = [...this.listaProductos, infoProducto];
      }
      sessionStorage.setItem('listaProductos', JSON.stringify(this.listaProductos));

      if (rowProduct && valorTotal && contarProductos && cartEmpty && cartTotal) {
        this.showHtml(rowProduct, valorTotal, contarProductos, cartEmpty, cartTotal);
      }
    }
  }

  /**
   * Permite agregar elementos al carrito de compras del sitio web.
   * Los productos agregos son almacenados en una variable de sesión
   */
  private funcionalidadCarrito(): void {
    const cartInfo = document.querySelector('.cart-product') as HTMLElement | null;
    const rowProduct = document.querySelector('.row-product') as HTMLElement | null;
    const productList = document.querySelector('.card-container') as HTMLElement | null;
    const valorTotal = document.querySelector('#total-pagar') as HTMLElement | null;
    const contarProductos = document.querySelector('#contador-productos') as HTMLElement | null;
    const cartEmpty = document.querySelector('.cart-empty') as HTMLElement | null;
    const cartTotal = document.querySelector('.cart-total') as HTMLElement | null;

    if (rowProduct && valorTotal && contarProductos && cartEmpty && cartTotal) {
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
      total += producto.cantidad * parseInt(producto.precio.replace(',', '').replace('$', ''));
      totalProductos += producto.cantidad;
      
    });

    valorTotal.innerText = `$${numberWithCommas(total)}`;
    contarProductos.innerText = totalProductos.toString();

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

