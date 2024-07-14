import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto';

/**
 * Servicio para gestionar operaciones CRUD de Productos
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  /**
   * Opciones de cabecera HTTP para las solicitudes.
   */
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }

  /**
   * URL base del endpoint de productos.
   */
  //private baseUrl = 'http://localhost:8080/productos';
  private baseUrl = 'http://52.200.236.194:8080/productos';

  /**
   * Constructor del servicio que inyecta el HttpClient.
   * @param http HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los usuarios.
   * @returns Un Observable con la lista de productos
   */
  obtenerTodosLosProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  /**
   * Obtiene el producto por su ID
   * @param id - ID del producto a obtener
   * @returns - Un Observable con el usuario agregado.
   */
  obtenerProductoPorID(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  agregarProducto(producto : Producto): Observable<Producto>{
    return this.http.post<Producto>(this.baseUrl, producto, this.httpOptions);
  }

  /**
   * Obtiene los productos segun su tipo
   * @param tipo - Tipo de producto a obtener
   * @returns - Un observable con los productos obtenidos segun su tipo
   */
  obtenerProductosPorTipo(tipo: String): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/tipo/${tipo}`);
  }

  /**
   * Actualiza un producto existente
   * @param id - Id del producto a actualizar
   * @param producto - Objeto de producto con los nuevos datos
   * @returns - Un observable con el producto actualizado
   */
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto, this.httpOptions);
  }

  eliminarProducto(id:number) : Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
