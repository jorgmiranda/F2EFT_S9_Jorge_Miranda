import { Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FooterComponent } from '../../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/prodcuto.service';
import { HttpClientModule } from '@angular/common/http';
import { Producto } from '../../../model/producto';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { Observable } from 'rxjs';

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
  //productForms: FormGroup[] = [];
  productForms: { [key: number]: FormGroup } = {};
  /**
   * Instancia vacia de arreglo de productos
   */
  products: Producto[] = [];
  /**
   * Tipo de productos
   */
  opciones: { value: string, display: string }[] = [
    { value: 'cuidado_capilar', display: 'Cuidado Capilar' },
    { value: 'cuidado_ropa', display: 'Cuidado de Ropa' },
    { value: 'limpieza', display: 'Limpieza' },
    { value: 'papel', display: 'Papel' },
  ];
  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;

  private storage:Storage = inject(Storage);


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
      
    });
    
    
  }

  /**
   * Inicializa la lista de productos basada en la sección actual.
   */
  inicializarProductos(){
    this.productoService.obtenerProductosPorTipo(this.seccion).subscribe(data => {
      this.products = data;
      this.inicializarFormularios();
    });

  }

  /**
   * Inicializa los formularios para cada producto con los datos actuales.
   */
  inicializarFormularios(): void{
    this.productForms = {};
    this.products.forEach((product) => {
      this.productForms[product.id] = this.fb.group({
        nombre: [product.nombre, Validators.required],
        precio: [product.precio, [Validators.required]],
        descripcion: [product.descripcion, Validators.required],
        tipoProducto: [product.tipoProducto, Validators.required],
        imagen: [null ]
      });
    });
  }

  /**
   * 
   * @param event 
   * @param productId 
   */
  onFileChange(event: Event, productId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.productForms[productId].get('imagen')?.setValue(file);
    
    }
  }

  /**
   * Permite la subida de archivos al Storage de Firebase
   * @param file - Archivo File obtenido desde la subida de archivos
   */
  async guardarImagenStorage(file: File) : Promise<string>{
    const filePath = `uploads/${file.name}`
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file);

    return new Promise<string>((resolve, reject) =>{
      uploadFile.on('state_changed',
        (snapshot) =>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Progreso de carga', progress);
        },
        (error) =>{
          console.error('Error en la carga del archivo: ', error);
        },
        async () =>{
          console.log('El archivo se subio exitosamente');
          const url = await getDownloadURL(fileRef);
          console.log('URL del archivo: '+url);
          resolve(url);
          
        }
      );
  
    });

    
    //return url;
  }

  /**
   * Maneja el envío de un formulario para actualizar un producto.
   * @param form - El formulario del producto que se está editando.
   * @param product - El producto correspondiente al formulario.
   */
  async onSubmit(form: FormGroup, product: Producto) {
    if (form.valid) {
      console.log(product.id)
      const updatedProduct = form.value;
      product.nombre = updatedProduct.nombre;
      product.precio = updatedProduct.precio;
      product.descripcion = updatedProduct.descripcion;
      //Verificar si hay archivo adjunto
      const file = form.get('imagen')?.value;
      if (file instanceof File) {
        const url = await this.guardarImagenStorage(file);
        //alert(url);
      }



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
