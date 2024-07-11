import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../navbar/navbar.component';
import { FooterComponent } from '../../../footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';

/**
 * @description
 * Componente de formulario de edición de perfil del usuario.
 * 
 * Este componente le permite al usuario editar su información con excepción del nombre de usuario.
 */
@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.scss',
  providers: [UsuarioService]
})
export class EditarPerfilComponent {

  /**
   * Formulario de actualización de datos del usuario
   */
  updateForm!: FormGroup;
  /**
   * Lista de usuarios almacenados en la variable de sesión
   */
  listaUsuarios: Usuario[] = [];
  /**
   * Instancia de usuario logeado usando la interfaz Usuario
   */
  usuariologeado?: Usuario;
  /**
   * @constructor
   * @param fb - Servicio de creación de formulario de Angular
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   */
  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) { }

  /**
   * Metodo de inicialización del componente.
   * Obtiene el usuario logeado en el sistema y crea el formulario de edición.
   */
  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
    
  }

  /**
   * Configura el formulario de edición.
   * Recupera la información obtenida del usuario logeado en el campo correspondiente para iniciar la edición.
   * Ademas se agregan las validaciones de campos requeridos, email y personalizadas
   */
  inicializarFormulario() {
    if (this.usuariologeado) {
      this.updateForm = this.fb.group({
        nombreCompleto: [this.usuariologeado.nombreCompleto, Validators.required],
        correoUsuario: [this.usuariologeado.correoUsuario, [Validators.required, Validators.email]],
        fechaNacimientoUsuario: [this.usuariologeado.fechaNacimiento, [Validators.required, this.validarEdad.bind(this)]],
        contrasenaUsuario1: [this.usuariologeado.contrasena, [Validators.required, this.validarContrasenaFormato()]],
        contrasenaUsuario2: [this.usuariologeado.contrasena, Validators.required],
        direccionDespacho: this.usuariologeado.direccionDespacho
      }, {
        validators: this.validarContrasenasIguales
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
      this.obtenerUsuario();
      this.inicializarFormulario();
    });
  }


  /**
   * Metodo encargado de la actualización del usuario.
   * Actualiza la información del usuario y muestra una alerta de JavaScript para notificar si el cambio fue completado.
   */
  actualizarUsuario(): void {
    if (this.updateForm.valid && this.usuariologeado) {
      const nombreUsuario = this.usuariologeado.nombreUsuario;
      const valoresFormulario = this.updateForm.value;
      this.usuariologeado.nombreCompleto = valoresFormulario.nombreCompleto;
      this.usuariologeado.correoUsuario = valoresFormulario.correoUsuario;
      this.usuariologeado.fechaNacimiento = valoresFormulario.fechaNacimientoUsuario;
      this.usuariologeado.contrasena = valoresFormulario.contrasenaUsuario1;
      this.usuariologeado.direccionDespacho = valoresFormulario.direccionDespacho;

      this.usuarioService.actualizarUsuario(this.usuariologeado.id, this.usuariologeado).subscribe(edit => {
        console.log('Usuario Editado Exitosamente', edit);
        this.obtenerTodosLosUsuarios();  
      }, error => {
        console.error('Ocurrio un error al agregar un usuario:', error);
      });

      alert('Usuario actualizado correctamente.');


    } else {
      alert('Favor de ingregar los campos obligatorios')
    }
  }


  /**
   * Valida que la edad del usuario sea mayor a 13 años
   * @param control - El control del formulario que contiene la fecha de nacimiento del usuario.
   * @returns  Un objeto con el error si el usuario es menor de edad, de lo contrario, null.
   */
  validarEdad(control: { value: string }): { [key: string]: boolean } | null {
    if (control.value) {
      const fechaNacimiento = new Date(control.value);
      const edad = this.calcularEdad(fechaNacimiento);
      if (edad < 13) { // Ejemplo: verificar que la persona sea mayor de 13 años
        return { menorDeEdad: true };
      }
    }
    return null;
  }

  /**
   * Calcula la edad de una persona basada en su fecha de nacimiento.
   * 
   * @param fechaNacimiento - La fecha de nacimiento del usuario.
   * @returns La edad del usuario en años.
   */
  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      return edad - 1;
    }
    return edad;
  }

  /**
   * Valida que las contraseñas ingresadas en dos campos del formulario sean iguales.
   * @param formGroup - El grupo de formulario que contiene los campos de las contraseñas.
   * @returns Un objeto con el error si las contraseñas no coinciden, de lo contrario, null.
   */
  validarContrasenasIguales(formGroup: FormGroup): { [key: string]: any } | null {
    const contrasena1 = formGroup.get('contrasenaUsuario1')?.value;
    const contrasena2 = formGroup.get('contrasenaUsuario2')?.value;

    return contrasena1 === contrasena2 ? null : { contrasenasNoCoinciden: true };
  }

  /**
   * Valida que una contraseña contenga al menos una letra mayúscula, un número y que tenga una longitud entre 6 y 18 caracteres.
   * 
   * @returns Una función validadora que puede ser usada en un control de formulario.
   */
  validarContrasenaFormato(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Si no hay valor, no se aplica la validación
      }

      const regex = /^(?=.*[0-9])(?=.*[A-Z]).{6,18}$/;
      const isValid = regex.test(control.value);

      return isValid ? null : { contrasenaInvalida: true };
    };
  }

  /**
   * Obtiene el usuario logeado en el sistema según la bandera correspondiente.
   */
  private obtenerUsuario() {
    this.listaUsuarios.forEach((usuario) => {
      if (usuario.sesionIniciada) {
        this.usuariologeado = usuario;
      }
    });

  }

}
