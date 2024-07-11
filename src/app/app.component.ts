import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/**
 * Componente inicial de la app
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
/**
 * App Component
 */
export class AppComponent {
  /**
   * Variable titulo
   */
  title = 'ActividadExamen';
}
