import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

/**
 * Servicio para gestionar operaciones CRUD de usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  /**
   * Opciones de cabecera HTTP para las solicitudes.
   */
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }

  /**
   * URL base del endpoint de usuarios.
   */
  //private baseUrl = 'http://localhost:8080/usuarios';
  private baseUrl = 'http://52.200.236.194:8080/usuarios';

  /**
   * Constructor del servicio que inyecta el HttpClient.
   * @param http HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {}

   /**
   * Obtiene la lista de todos los usuarios.
   * @returns Un Observable con la lista de usuarios.
   */
  obtenerTodosLosUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario a obtener.
   * @returns Un Observable con el usuario correspondiente al ID.
   */
  obtenerUsuarioPorId(id:number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  /**
   * Agrega un nuevo usuario.
   * @param usuario Objeto usuario a agregar.
   * @returns Un Observable con el usuario agregado.
   */
  agregarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario, this.httpOptions);
  }

  /**
   * Actualiza un usuario existente.
   * @param id ID del usuario a actualizar.
   * @param usuario Objeto usuario con los nuevos datos.
   * @returns Un Observable con el usuario actualizado.
   */
  actualizarUsuario(id:number, usuario:Usuario) : Observable<Usuario>{
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario, this.httpOptions);
  }

  /**
   * Elimina un usuario por su ID.
   * @param id ID del usuario a eliminar.
   * @returns Un Observable vacío que indica la eliminación.
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     "Content-Type": "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //     "Authorization": "Bearer f2acfee9-2180-495a-ba3a-d008e657384a"
  //   })
  // }

  // private jsonURL = "https://firebasestorage.googleapis.com/v0/b/sumativa3-e62f1.appspot.com/o/usuarios.json?alt=media&token=f2acfee9-2180-495a-ba3a-d008e657384a";

  // private listaUsuarios:any;

  // constructor(private http:HttpClient) { }

  // getUserJsonData() : Observable<any>{
  //   return this.http.get(this.jsonURL)
  // }

  // crearUsuarios(listaUsuarios:any){
  //   console.log(listaUsuarios);
  //   this.http.post(this.jsonURL, listaUsuarios, this.httpOptions).subscribe(
  //     response => {
  //       console.log('Archivo JSON sobreescrito con exito', response);
  //     },
  //     error => {
  //       console.error("Error al sobreescribir el archivo JSON", error);
  //     })
  // }



}
