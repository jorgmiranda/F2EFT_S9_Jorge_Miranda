import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FooterComponent } from '../../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/prodcuto.service';
import { HttpClientModule } from '@angular/common/http';

/**
 * @description
 * Componente para editar productos en diferentes secciones. Permite inicializar productos según la sección,
 * gestionar formularios de edición y actualizar la información de los productos.
 */
@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [NavbaradminComponent, CommonModule, FooterComponent, ReactiveFormsModule, HttpClientModule],
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ProductoService]
})
export class EditarProductosComponent implements OnInit{
  /**
   * Variable sección que mostrara los productos según corresponda
   */
  seccion: string = ''; 
  /**
   * instancia de form group
   */
  productForms: FormGroup[] = [];
  /**
   * Instancia vacia de arreglo de productos
   */
  products: any[] = [];

  /**
   * @constructor
   * @param route - Servicio de enrutamiento de Angular
   * @param fb - Servicio de creación de formulario de Angular
   */
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private productoService: ProductoService) { }

  /**
   * Metodo de inicialización del componente
   * Obtiene la sección de la ruta y llama a los métodos para inicializar productos y formularios.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.seccion = params.get('seccion') || '';
      this.inicializarProductos();
      this.inicializarFormularios();
    });
    
    
  }

  /**
   * Inicializa la lista de productos basada en la sección actual.
   */
  inicializarProductos(){
    this.productoService.obtenerProductosPorTipo(this.seccion).subscribe(data => {
      this.products = data;
    });

  }

  /**
   * Inicializa los formularios para cada producto con los datos actuales.
   */
  inicializarFormularios(): void{
    this.productForms = [];
    this.products.forEach((product) => {
      this.productForms.push(this.fb.group({
        nombre: [product.nombre, Validators.required],
        precio: [product.precio, [Validators.required]],
        descripcion: [product.descripcion, Validators.required]
      }));
    });
  }

  /**
   * Maneja el envío de un formulario para actualizar un producto.
   * @param form - El formulario del producto que se está editando.
   * @param product - El producto correspondiente al formulario.
   */
  onSubmit(form: FormGroup, product: any) {
    if (form.valid) {
      const updatedProduct = form.value;
      product.nombre = updatedProduct.nombre;
      product.precio = updatedProduct.precio;
      product.descripcion = updatedProduct.descripcion;
      alert('La información del producto ha sido actualizada correctamente.');
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
  
/**
 * Formatea un numero con el formato de peso chileno
 * 
 * @param x 
 * @returns 
 */
  numberWithCommas(x: string): string {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
