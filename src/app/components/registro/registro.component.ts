import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn, AbstractControl  } from '@angular/forms'; 
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';

/**
 * @description
 * Componente de formulario de registro para un nuevo Usuario
 * 
 * Este componente le permite a los nuevos usuarios registrarse en el sistema
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  providers: [UsuarioService]
})
export class RegistroComponent {
  /**
   * Formulario de registro
   */
  registrationForm!: FormGroup;
  /**
   * Lista de usuarios almancenados en sesión
   */
  listaUsuarios: Usuario[] = [];

  /**
   * @constructor
   * @param fb - Servicio de creación de formulario de Angular
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   */
  constructor (private usuarioService: UsuarioService, private fb: FormBuilder) {}

  /**
   * Metodo de inicialización del componente.
   * Inicializa el formulario de registro con sus validadores correspondientes.
   */
  ngOnInit(): void{
    this.registrationForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      fechaNacimientoUsuario: ['', [Validators.required, this.validarEdad.bind(this)]],
      contrasenaUsuario1: ['', [Validators.required, this.validarContrasenaFormato()]],
      contrasenaUsuario2:['', Validators.required],
      direccionDespacho: ''
    },{
      validators: this.validarContrasenasIguales
    });
    this.obtenerTodosLosUsuarios();
  }

  /**
   * Obtiene todos los usuarios registrados en el JSON REST
   * Una vez obtenidos, llama al metodo verificarSessionUsuario
   */
  obtenerTodosLosUsuarios():void{
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  /**
   * Registra el usuario en el sistema
   * Guarda la información del usuario en una variable de sesión, la cual es capaz de soportar multiples usuarios.
   */
  registrarUsuario(): void {
    if(this.registrationForm.valid){
      // Se Obtienen los usuarios registrados o inicia un arreglo vacio
      //this.listaUsuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');
      //Se crea el objeto usuario con los valores del formulario
      const nuevoUsuario: Usuario = {
        id: this.listaUsuarios.length > 0 ? Math.max(...this.listaUsuarios.map((p: any) => p.id)) + 1 : 1,
        nombreCompleto: this.registrationForm.get('nombreCompleto')!.value,
        nombreUsuario: this.registrationForm.get('nombreUsuario')!.value,
        correoUsuario: this.registrationForm.get('correoUsuario')!.value,
        direccionDespacho: this.registrationForm.get('direccionDespacho')!.value,
        contrasena: this.registrationForm.get('contrasenaUsuario1')!.value,
        fechaNacimiento: this.registrationForm.get('fechaNacimientoUsuario')!.value,
        sesionIniciada: false,
        rol: "Usuario"
    };

    //Agregar usuario
    this.usuarioService.agregarUsuario(nuevoUsuario).subscribe(nuevo => {
      console.log('Usuario Agregado Exitosamente', nuevo); 
    }, error => {
      console.error('Ocurrio un error al agregar un usuario:', error);
    });

    alert("Te has registrado con éxito.");

    this.registrationForm.reset();
    }else{
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
   * Limpia los campos de formulario
   * Metodo que borra la información que esta presente en el formulario de registro
   */
  limpiarFormulario(): void {
    this.registrationForm.reset();
   
  }


}
