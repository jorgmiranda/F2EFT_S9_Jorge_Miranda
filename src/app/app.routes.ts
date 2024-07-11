import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './components/productos/productos.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { EditarPerfilComponent } from './components/usuario/editar-perfil/editar-perfil.component';
import { EditarProductosComponent } from './components/admin/editar-productos/editar-productos.component';
import { InicioAdminComponent } from './components/admin/inicio-admin/inicio-admin.component';
import { ListaUsuariosComponent } from './components/admin/lista-usuarios/lista-usuarios.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'producto/:seccion', component: ProductosComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'login', component: LoginComponent},
    {path: 'recuperarContrasena', component:RecuperarContrasenaComponent},
    {path: 'usuario/editarDatos', component:EditarPerfilComponent},
    {path: 'admin/inicio', component:InicioAdminComponent},
    {path: 'admin/editarProducto/:seccion', component:EditarProductosComponent},
    {path: 'admin/mantenedorUsuarios', component:ListaUsuariosComponent},
    //Pagina de inicio
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: '**', redirectTo: 'inicio'}
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }