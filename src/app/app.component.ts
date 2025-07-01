import {Component, OnInit, Renderer2} from '@angular/core';
import {OverlayContainer} from "@angular/cdk/overlay";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    // Cambia esto según la empresa
    public companyName = 'fb'; // gs = Gusa Capital, fb = Flyback, vc = Vacations Center

    constructor(
        private overlayContainer: OverlayContainer,
        private renderer: Renderer2,
    ) {
    }

    ngOnInit(): void {
        this.applyTheme(this.companyName);
    }

    applyTheme(company: string): void {
        const themeClass = `${company}-theme`;

        // Elimina todas las clases de tema anteriores
        const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
        overlayContainerClasses.remove('gs-theme', 'fb-theme', 'vc-theme');

        // Añade la clase del tema seleccionado
        overlayContainerClasses.add(themeClass);

        // Aplica la clase al elemento principal del componente
        this.renderer.addClass(document.body, themeClass);
    }
}
