import {Component, input, output, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

export interface SidebarItem {
    label: string;
    icon: string;
    route?: string;
    disabled?: boolean;
    badge?: string;
    children?: SidebarItem[];
}

export interface SidebarGroup {
    groupLabel: string;
    items: SidebarItem[];
}

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    readonly isOpen = input<boolean>(false);
    readonly closeSidebar = output<void>();

    public openDropdowns = signal<Set<string>>(new Set());

    public menuGroups: SidebarGroup[] = [
        {
            groupLabel: 'Panel Principal',
            items: [
                { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
            ]
        },
        {
            groupLabel: 'Ministerio Infantil',
            items: [
                { label: 'Registro de niños', icon: 'pi pi-users', route: '/kids' },
                { label: 'Check-ins del día', icon: 'pi pi-calendar-clock', route: '/kids/checkins' },
                // Reportes deshabilitado temporalmente - pendiente de implementación
                // { label: 'Reportes', icon: 'pi pi-file-excel', route: '/kids/reportes' },
            ]
        },
        {
            groupLabel: 'Membresía',
            items: [
                { label: 'Directorio', icon: 'pi pi-address-book', route: '/members', disabled: true, badge: 'Próximamente' },
                { label: 'Familias', icon: 'pi pi-sitemap', route: '/families', disabled: true, badge: 'Próximamente' },
            ]
        },
        {
            groupLabel: 'Eventos',
            items: [
                { label: 'Asistencia', icon: 'pi pi-calendar', route: '/events', disabled: true, badge: 'Próximamente' },
            ]
        },
        {
            groupLabel: 'Voluntarios',
            items: [
                { label: 'Directorio', icon: 'pi pi-id-card', route: '/volunteers', disabled: true, badge: 'Próximamente' },
            ]
        },
        {
            groupLabel: 'Administración',
            items: [
                { label: 'Configuración', icon: 'pi pi-cog', route: '/settings', disabled: true },
            ]
        },
    ];

    toggleDropdown(label: string): void {
        this.openDropdowns.update(current => {
            const next = new Set(current);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });
    }

    isDropdownOpen(label: string): boolean {
        return this.openDropdowns().has(label);
    }

    onNavigate(): void {
        this.closeSidebar.emit();
    }
}
