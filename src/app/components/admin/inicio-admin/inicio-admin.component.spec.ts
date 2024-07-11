import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { InicioAdminComponent } from './inicio-admin.component';

describe('InicioAdminComponent', () => {
  let component: InicioAdminComponent;
  let fixture: ComponentFixture<InicioAdminComponent>;

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
      imports: [InicioAdminComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InicioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia Crear', () => {
    expect(component).toBeTruthy();
  });
});
