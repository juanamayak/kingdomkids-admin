import {Component, inject, OnInit, output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {BrandService} from '../../../core/services/brand.service';
import {SessionService} from '../../../core/services/session.service';

@Component({
    selector: 'app-navbar',
    imports: [ButtonModule, MenuModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

    private brandService = inject(BrandService);
    private sessionService = inject(SessionService);

    public logo = this.brandService.logo;
    public projectName = this.brandService.projectName;
    public items: MenuItem[] | undefined;
    public toggleSidebar = output<void>();

    ngOnInit(): void {
        this.items = [
            {
                label: 'Menú',
                items: [
                    {
                        label: 'Cerrar sesión',
                        icon: 'pi pi-sign-out',
                        command: () => this.sessionService.logout()
                    }
                ]
            }
        ];
    }

    onToggleSidebar(): void {
        this.toggleSidebar.emit();
    }
}
