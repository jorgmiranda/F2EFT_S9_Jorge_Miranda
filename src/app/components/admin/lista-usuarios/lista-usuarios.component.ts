import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FooterComponent } from '../../../footer/footer.component';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';
/**
 * Se declara la variable de bootstrap para el modal
 */
declare var bootstrap: any;

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [NavbaradminComponent, FooterComponent, HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
  providers: [UsuarioService]
})
/**
 * Componente encargado de administrar el mantenedor de Usuarios
 */
export class ListaUsuariosComponent {

  usuarios: any[] = [];
  //Atributos del modal
  modalTitle: string = '';
  modalInstance: any;
  //fomulario
  mantenedorForm!: FormGroup;
  //id de edición
  editingId: number | null = null;
  //Roles
  rolesOpciones = ['Usuario', 'Administrador']

  /**
   * @constructor
   * @param usuarioService - Servicio de de Usuarios utilizado para consumir los servicios REST
   * @param fb - Servicio de creación de formulario de Angular
   */
  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) { }

   /**
   * Metodo de inicialización del componente.
   * Inicializa el formulario de edición/creación, modal y cargar los usuarios
   */
  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
    this.inicializarFormulario();
    this.modalInstance = new bootstrap.Modal(document.getElementById('usuarioModal'));
    

  }

  /**
   * Obtiene todos los usuarios registrados en el JSON REST
   * Una vez obtenidos, llama al metodo verificarSessionUsuario
   */
  obtenerTodosLosUsuarios():void{
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  /**
   * Inicializa el formulario de creación
   */
  inicializarFormulario() {
    this.mantenedorForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required, this.validarEdad.bind(this)]],
      contrasenaUsuario1: ['', [Validators.required, this.validarContrasenaFormato()]],
      contrasenaUsuario2: ['', Validators.required],
      rol: [this.rolesOpciones[0], Validators.required],
      direccionDespacho: ['']
    }, {
      validators: this.validarContrasenasIguales
    });
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
   * Verifica si se intenta registrar un usuario o editarlo.
   * En caso de editarlo, recupera la información de este.
   * @param usuario - Parametro del usuario a editar
   */
  abrirModal(usuario?: Usuario): void {
    if (usuario) {
      this.modalTitle = 'Modificar usuario';
      //this.mantenedorForm.patchValue(usuario);
      this.mantenedorForm.patchValue({
        ...usuario, // Añade todos los campos del usuario
        contrasenaUsuario1: usuario.contrasena,
        contrasenaUsuario2: usuario.contrasena,  
      });
      this.editingId = usuario.id;
      
    } else {
      this.modalTitle = 'Agregar usuario';
      this.mantenedorForm.reset({
        roles: this.rolesOpciones[0], // establecer el valor predeterminado
      });
      this.editingId = null;
    }
    this.modalInstance.show();
  }

  /**
   * Verifica si el submit es para creación o edición.
   * En caso de crear, se envia la solicitud al servicio 
   * En caso de editar, se modifica el usuario con los parametros entregados
   */
  submitForm(): void {
    if (this.mantenedorForm.valid) {
      const persona = this.mantenedorForm.value;
      if (this.editingId !== null) {
        // Lógica para actualizar la persona
        const usuarioActualizado: Usuario = {
          id: this.editingId!,
          nombreCompleto: this.mantenedorForm.get('nombreCompleto')?.value,
          nombreUsuario: this.mantenedorForm.get('nombreUsuario')?.value,
          correoUsuario: this.mantenedorForm.get('correoUsuario')?.value,
          fechaNacimiento: this.mantenedorForm.get('fechaNacimiento')?.value,
          contrasena: this.mantenedorForm.get('contrasenaUsuario1')?.value,
          direccionDespacho: this.mantenedorForm.get('direccionDespacho')?.value,
          rol: this.mantenedorForm.get('rol')?.value,
          sesionIniciada: false
        };
         // Actualiza la lista de usuarios
        this.usuarios = this.usuarios.map(u => u.id === this.editingId ? usuarioActualizado : u);
        this.usuarioService.actualizarUsuario(this.editingId, usuarioActualizado).subscribe(edit => {
          console.log('Usuario Editado Exitosamente', edit);
          this.obtenerTodosLosUsuarios();  
        }, error => {
          console.error('Ocurrio un error al editar un usuario:', error);
        });
      } else {
        // Lógica para agregar nueva persona
        const nuevoUsuario: Usuario = {
          id: this.usuarios.length > 0 ? Math.max(...this.usuarios.map((p: any) => p.id)) + 1 : 1,
          nombreCompleto: this.mantenedorForm.get('nombreCompleto')?.value,
          nombreUsuario: this.mantenedorForm.get('nombreUsuario')?.value,
          contrasena: this.mantenedorForm.get('contrasenaUsuario1')?.value,
          correoUsuario: this.mantenedorForm.get('correoUsuario')?.value,
          fechaNacimiento: this.mantenedorForm.get('fechaNacimiento')?.value,
          direccionDespacho: this.mantenedorForm.get('direccionDespacho')?.value,
          rol: this.mantenedorForm.get('rol')?.value,
          sesionIniciada: false
        }
        console.log(nuevoUsuario);
        this.usuarios.push(nuevoUsuario);
        this.usuarioService.agregarUsuario(nuevoUsuario).subscribe(nuevo => {
          console.log('Usuario Agregado Exitosamente', nuevo);
          this.obtenerTodosLosUsuarios();  
        }, error => {
          console.error('Ocurrio un error al agregar un usuario:', error);
        });
      }
      
      this.modalInstance.hide();
    } else {
      console.log(this.mantenedorForm.errors);
      alert('Favor de ingresar los campos obligatorios');
    }
  }

  /**
   * Eliminar el usuario de la lista
   * @param usuario - Usuario a elminar
   */
  eliminar(usuario: Usuario): void {
    const index = this.usuarios.findIndex((elemento: any) => elemento.id === usuario.id);
    
    if (index !== -1) {
      this.usuarios.splice(index, 1);
      this.usuarioService.eliminarUsuario(usuario.id).subscribe(elimnado => {
        console.log('Usuario Eliminado Exitosamente');
        this.obtenerTodosLosUsuarios();
        alert("Usuario Eliminado Exitosamente");  
      }, error => {
        console.error('Ocurrio un error al eliminar un usuario:', error);
      });
    } else {
      window.alert('El elemento de la lista no existe');
    }
  }
}
