import {Component, signal} from '@angular/core';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-main-layout',
    imports: [NavbarComponent, SidebarComponent, RouterOutlet],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

    public isSidebarOpen = signal(false);

    toggleSidebar(): void {
        this.isSidebarOpen.update(v => !v);
    }

    closeSidebar(): void {
        this.isSidebarOpen.set(false);
    }
}
