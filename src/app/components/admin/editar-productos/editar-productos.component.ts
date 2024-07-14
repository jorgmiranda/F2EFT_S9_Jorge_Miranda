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


/**
 * Se declara la variable de bootstrap para el modal
 */
declare var bootstrap: any;

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
  productForms: { [key: number]: FormGroup } = {};
  /**
   * Instancia de formulario para creación de productos
   */
  crearProdcutoForm!: FormGroup;
  /**
   * Instancia vacia de arreglo de productos
   */
  products: Producto[] = [];
  /**
   * Obtiene todos los productos del json
   */
  allProducts:Producto [] = [];
  /**
   * Tipo de productos
   */
  opciones: { value: string, display: string }[] = [
    { value: 'cuidado_capilar', display: 'Cuidado Capilar' },
    { value: 'cuidado_ropa', display: 'Cuidado de Ropa' },
    { value: 'limpieza', display: 'Limpieza' },
    { value: 'papel', display: 'Papel' },
  ];

  /**
   * Instancia de Storage para integrarse con firebase
   */
  private storage:Storage = inject(Storage);

  /**
   * Instancia de modal utilizada para la creación de productos
   */
  modalInstance: any;

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
      this.modalInstance = new bootstrap.Modal(document.getElementById('productoModal'));
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

    this.productoService.obtenerTodosLosProductos().subscribe(data => {
      this.allProducts = data;
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

    this.crearProdcutoForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      precioProducto: ['', Validators.required],
      tipoProducto: [this.seccion, Validators.required],
      descripcionProducto: ['', Validators.required],
      imagenProducto: [null]
    });
  }

  /**
   * Permite visualizar el modal definido
   */
  abrirModal(): void {
    this.modalInstance.show();
  }

  /**
   * Cuando se cambia un input file, se toma el valor y lo setea al campo imagen
   * @param event - Variable de evento
   * @param productId - Id del producto a editar
   */
  onFileChange(event: Event, productId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.productForms[productId].get('imagen')?.setValue(file);
    
    }
  }

  /**
   * Cuando se cambia un input file, se toma el valor y lo setea al campo imagen producto
   * Solo ocurre en la creación
   * @param event - Variable de evento
   */
  onFileChangeCreate(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.crearProdcutoForm.get('imagenProducto')?.setValue(file);
    
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
      product.tipoProducto = updatedProduct.tipoProducto;
      console.log(product);
      //Verificar si hay archivo adjunto
      const file = form.get('imagen')?.value;
      if (file instanceof File) {
        const url = await this.guardarImagenStorage(file);
        product.urlImg = url;
      }

      this.productoService.actualizarProducto(product.id, product).subscribe(edit =>{
        console.log("El Producto a sido actualizado exitosamente ",edit  );
        this.inicializarProductos();
      }, error => {
        console.error('Ocurrio un error al editar el producto:', error);
      });

      alert('La información del producto ha sido actualizada correctamente.');
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
  /**
   * Eliminar un producto seleccionado. 
   * @param event - Variable evento
   * @param prodcuto - producto a eliminar
   */
  eliminar(event: Event, prodcuto : Producto){
    event.preventDefault();
    this.productoService.eliminarProducto(prodcuto.id).subscribe(eliminado =>{
      console.log("El prodcuto fue eliminado correctamente");
      this.inicializarProductos();
      alert("Producto eliminado exitosamente");
    }, error => {
      console.error('Ocurrio un error al eliminar el producto:', error);
    });
  }

  /**
   * Encargado de manejar la creación de un nuevo producto
   */
  async submitForm(){
    if(this.crearProdcutoForm.valid){
      const file = this.crearProdcutoForm.get('imagenProducto')?.value;
      if (file instanceof File) {
        const url = await this.guardarImagenStorage(file);

        const nuevoProdcuto: Producto = {
          id :this.allProducts.length > 0 ? Math.max(...this.allProducts.map((p: any) => p.id)) + 1 : 1,
          nombre: this.crearProdcutoForm.get('nombreProducto')?.value,
          precio: this.crearProdcutoForm.get('precioProducto')?.value,
          tipoProducto: this.crearProdcutoForm.get('tipoProducto')?.value,
          descripcion: this.crearProdcutoForm.get('descripcionProducto')?.value,
          urlImg: url
        }

        console.log(nuevoProdcuto);
        this.productoService.agregarProducto(nuevoProdcuto).subscribe(nuevo =>{
          console.log("Producto Agregado Exitosamente!");
          this.inicializarProductos();
        }, error => {
          console.error('Ocurrio un error al agregar un producto:', error);
        });
        this.modalInstance.hide();
        alert("Producto Creado Exitosamente");

      }else{
        alert("Favor de subir una imagen para el producto");
      }

    }else {
      console.log(this.crearProdcutoForm.errors);
      alert('Favor de ingresar los campos obligatorios');
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
