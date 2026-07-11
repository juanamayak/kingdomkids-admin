import {Injectable, inject} from '@angular/core';
import {BRAND_CONFIG} from '../constants/brand.config';

@Injectable({
    providedIn: 'root'
})
export class BrandService {

    private readonly config = BRAND_CONFIG;

    get logo(): string { return this.config.assets.logo; }
    get logoWhite(): string { return this.config.assets.logoWhite; }
    get companyName(): string { return this.config.companyName; }
    get projectName(): string { return this.config.projectName; }
    get copyright(): string { return this.config.copyright; }
    get background(): string { return this.config.assets.background; }

    applyThemeColors(): void {
        const root = document.documentElement;
        root.style.setProperty('--bg-login', `url(${this.config.assets.background})`);
        root.style.setProperty('--color-primary', this.config.colors.primary);
        root.style.setProperty('--color-primary-hover', this.config.colors.primaryHover);
        root.style.setProperty('--color-sidebar', this.config.colors.sidebar);
    }

    applyFavicon(): void {
        const favicon = document.getElementById('app-favicon') as HTMLLinkElement;
        if (favicon) {
            favicon.href = this.config.assets.favicon;
        }
    }

    /**
     * Inicializa la configuración de marca (colores CSS y favicon) al arrancar la app.
     */
    init(): void {
        this.applyThemeColors();
        this.applyFavicon();
    }
}

