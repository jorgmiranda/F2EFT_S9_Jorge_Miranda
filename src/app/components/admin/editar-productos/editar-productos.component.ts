import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FooterComponent } from '../../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

/**
 * @description
 * Componente para editar productos en diferentes secciones. Permite inicializar productos según la sección,
 * gestionar formularios de edición y actualizar la información de los productos.
 */
@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [NavbaradminComponent, CommonModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.scss',
  encapsulation: ViewEncapsulation.None
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
  constructor(private route: ActivatedRoute, private fb: FormBuilder) { }

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
    if (this.seccion === 'cuidado_capilar') {
      this.products = [
        {
          nombre: 'Acond. DoyPack IO Camomilla 1000ml',
          precio: '1020',
          descripcion: 'Descubre el arte del cuidado personal con el Acondicionador DoyPack IO Camomilla. Este producto incorpora esencias de camomila que nutren, revitalizan y dan suavidad a tu cabello.',
          image: 'assets/img/cuidado_capilar/Acond. DoyPack IO Camomilla 1000ml.jpg',
        },
        {
          nombre: 'Acond. DoyPack IO Hierbas 1000ml',
          precio: '1020',
          descripcion: 'Vive una experiencia saludable con nuestro DoyPack IO Hierbas. Este producto único está especialmente formulado con una selección premium de hierbas, brindándote un sabor inigualable y beneficios para tu salud.',
          image: 'assets/img/cuidado_capilar/Acond. DoyPack IO Hierbas 1000ml.jpg',
        },
        {
          nombre: 'Shampoo DoyPack IO Huevo 1000ml',
          precio: '1020',
          descripcion: 'Transfórmate en la mejor versión de ti con nuestro Shampoo DoyPack IO Quillay. Único en su clase, desenvuelve la magia de la naturaleza para darle vida y vigor a tu cabello.',
          image: 'assets/img/cuidado_capilar/Shampoo DoyPack IO Huevo 1000ml.jpg',
        },
        {
          nombre: 'Shampoo DoyPack IO Quillay 1000ml',
          precio: '1020',
          descripcion: 'Redefine tu cuidado del cabello con el Shampoo DoyPack IO Huevo. Nutre, revitaliza y protege tu cabello con intensidad gracias a su fórmula exclusiva con extractos de huevo.',
          image: 'assets/img/cuidado_capilar/Shampoo DoyPack IO Quillay 1000ml.jpg',
        }
      ];
    }else if(this.seccion == 'cuidado_ropa'){
      this.products = [
        {
          nombre: 'Jabon de Lavar barra Doña Tuti 170 grs',
          precio: '5000',
          descripcion: 'Jabón para Lavar en Barra Doña Tuti, poder de limpieza.',
          image: 'assets/img/cuidado_ropa/Jabon de Lavar barra Doña Tuti 170 grs.jpg',
        },
        {
          nombre: 'Cloro Concentrado Briks 5 Lts',
          precio: '1899',
          descripcion: 'Disfrute de un hogar impecablemente limpio con el cloro líquido Briks. Este potente limpiador ofrece una desinfección y limpieza completa, eliminando efectivamente bacterias y suciedad.',
          image: 'assets/img/cuidado_ropa/Cloro Concentrado Briks 5 Lts.jpg',
        },
        {
          nombre: 'Detergentes Briks Verde 5 Lts',
          precio: '3120',
          descripcion: 'Nunca antes tus prendas habían lucido tan bien. Introducimos Detergentes Briks Verde de 5 litros, tú solución definitiva para un lavado profundo y aromatizante.',
          image: 'assets/img/cuidado_ropa/Detergentes Briks Verde 5 Lts.jpg',
        },
        {
          nombre: 'Suavizante Doña Tuti Aloe Vera 1000ml',
          precio: '1100',
          descripcion: 'Suavizante Doña Tuti Aloe Vera 1000ml.',
          image: 'assets/img/cuidado_ropa/Suavizante Doña Tuti Aloe Vera 1000ml.jpg',
        }
      ];

    }else if(this.seccion == 'limpieza'){
      this.products = [
        {
          nombre: 'Cloro Gel Briks Citrus 900ml',
          precio: '1050',
          descripcion: 'Dile adiós a las bacterias con Cloro Gel Briks Citrus. Potenciado con un fresco aroma a cítricos, este producto de limpieza multifuncional ofrece una solución poderosa a tu alcance.',
          image: 'assets/img/Limpieza/Cloro Gel Briks Citrus 900ml.jpg',
        },
        {
          nombre: 'Lavaloza Verde Briks 2 Lts',
          precio: '1430',
          descripcion: 'Revitaliza y da vida a tus platos con Lavaloza Verde Briks. Este detergente innovador no solo limpia a profundidad, sino que también cuida de tus manos, gracias a su formula exclusiva.',
          image: 'assets/img/Limpieza/Lavaloza Verde Briks 2 Lts.jpg',
        },
        {
          nombre: 'Trapero Humedo Doña Tuti Lavanda 40x60cm',
          precio: '1799',
          descripcion: 'Trapero Humedo Doña Tuti Lavanda 40x60cm.',
          image: 'assets/img/Limpieza/Trapero Humedo Doña Tuti Lavanda 40x60cm.jpg',
        },
        {
          nombre: 'Lavalozas Briks Verde 5 Lts',
          precio: '3120',
          descripcion: 'Como por arte de magia. Esta solución líquida es potente y eficaz, eliminando todo tipo de suciedad adherida en los platos y utensilios de cocina. Su fórmula única, biodegradable, respeta el medio ambiente, mientras garantiza la limpieza profunda que usted necesita.',
          image: 'assets/img/Limpieza/Lavalozas Briks Verde 5 Lts.jpg',
        }
      ];
    }else{
      this.products = [
        {
          nombre: 'Toalla de papel Nobby Fit',
          precio: '680',
          descripcion: 'Toalla de papel Bobby Fit',
          image: 'assets/img/papel/Toalla de papel Nobby Fit.jpg',
        },
        {
          nombre: 'Servilleta Doña Tuti (Premium)',
          precio: '1290',
          descripcion: '300 Unidades por Paquete',
          image: 'assets/img/papel/Servilleta Doña Tuti (Pack Familiar Premium).jpg',
        },
        {
          nombre: 'Papel Higiénico Top One 20mts (Pack 12r)',
          precio: '2499',
          descripcion: 'Papel Higiénico Top One 20 metros, pack de 12 rollos.',
          image: 'assets/img/papel/Papel Higiénico Top One 20mts (Pack 12r).jpg',
        },
        {
          nombre: 'Toalla Mediana HiperMax XL Doble Hoja',
          precio: '2580',
          descripcion: 'Toalla HiperMax XL Doble Hoja 100 Mts',
          image: 'assets/img/papel/Toalla Mediana HiperMax XL Doble Hoja.jpg',
        }
      ];
    }
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
