import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavbaradminComponent } from './navbaradmin.component';

describe('NavbaradminComponent', () => {
  let component: NavbaradminComponent;
  let fixture: ComponentFixture<NavbaradminComponent>;

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
      imports: [NavbaradminComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbaradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia Crear', () => {
    expect(component).toBeTruthy();
  });
});
