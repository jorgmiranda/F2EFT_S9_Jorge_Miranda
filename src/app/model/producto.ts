/**
 * @description
 * Interfaz implementada que representa la información de un producto en el sistema
 */
export interface Producto {
     /**
     * Numero identificador del producto
     * @example 1
     */
     id: number;
     /**
     * Nombre del producto
     * @example "Papel Higiénico"
     */
     nombre: String;
     /**
      * Precio del producto
      * @example 5200
      */
     precio: number;
     /**
      * Descripcion del producto
      * @example "Toalla HiperMax XL Doble Hoja 100 Mts"
      */
     descripcion: String;
     /**
      * Clasificación del producto
      * @example "papel"
      */
     tipoProducto: String;
     /**
      * ubicación de la imagen relacionado al producto
      * @example "assets/img/papel/Toalla Mediana HiperMax XL Doble Hoja.jpg"
      */
     urlImg: String;
}
