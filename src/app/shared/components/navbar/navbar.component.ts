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
    public username = this.sessionService.getUsername();
    public items: MenuItem[] | undefined;
    public toggleSidebar = output<void>();

    ngOnInit(): void {
        this.username = this.sessionService.getUsername();
        this.items = [
            {
                label: this.username,
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
