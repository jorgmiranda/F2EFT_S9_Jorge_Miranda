import { Component } from '@angular/core';
import { NavbaradminComponent } from '../navbaradmin/navbaradmin.component';
import { FooterComponent } from '../../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';

/**
 * @description
 * Componente Inicio Administrador
 * 
 * Es la primera pagina que se visualiza al iniciar sesión como administrador, todavia esta construcción
 */
@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  imports: [NavbaradminComponent, FooterComponent, HttpClientModule],
  templateUrl: './inicio-admin.component.html',
  styleUrl: './inicio-admin.component.scss'
})
export class InicioAdminComponent {

}
