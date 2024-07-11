import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { RegistroComponent } from './registro.component';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  // Mock de ActivatedRoute
  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: () => 'registro' 
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule, NavbarComponent, FooterComponent, CommonModule],
      providers:[
        {provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia Crear', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia inicializar el formulario correctamente', () =>{
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('Deberia Validar el formato de la contraseña', () => {
    const control = component.registrationForm.get('contrasenaUsuario1');
    control?.setValue('ValidPassword1'); // Contraseña válida según el regex
    expect(control?.valid).toBeTruthy();

    control?.setValue('invalidpassword'); // Contraseña inválida según el regex
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['contrasenaInvalida']).toBeTruthy();
  });

  it('Deberia Validar la contraseña como campo obligatorio', () => {
    const control = component.registrationForm.get('contrasenaUsuario1');
    control?.setValue('ValidPassword1'); // Contraseña válida según el regex y con un valor
    expect(control?.valid).toBeTruthy();

    control?.setValue(''); // Contraseña inválida por no ingresar un valor
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['required']).toBeTruthy();
  });
  
  it('Deberia Validar la nombre de usuario como campo obligatorio', () => {
    const control = component.registrationForm.get('nombreUsuario');
    control?.setValue('jorg.sanchezm'); // Contraseña válida según el regex y con un valor
    expect(control?.valid).toBeTruthy();

    control?.setValue(''); // Contraseña inválida por no ingresar un valor
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['required']).toBeTruthy();
  });
  
  it('Deberia retornar null por fecha valida', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20); // Usuario de 20 años
    const result = component.validarEdad({ value: date.toISOString() });
    expect(result).toBeNull();
  });

  it('deberia retornar { menorDeEdad: true } por fecha invalida', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10); // Usuario de 10 años
    const result = component.validarEdad({ value: date.toISOString() });
    expect(result).toEqual({ menorDeEdad: true });
  });

});
