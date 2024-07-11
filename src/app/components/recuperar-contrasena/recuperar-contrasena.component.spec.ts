import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';

describe('RecuperarContrasenaComponent', () => {
  let component: RecuperarContrasenaComponent;
  let fixture: ComponentFixture<RecuperarContrasenaComponent>;
  
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
      imports: [RecuperarContrasenaComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia Crear', () => {
    expect(component).toBeTruthy();
  });
});
