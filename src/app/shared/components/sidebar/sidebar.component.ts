import {Component, input, output, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';

export interface SidebarItem {
    label: string;
    icon: string;
    route?: string;
    children?: SidebarItem[];
}

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive, NgClass],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    readonly isOpen = input<boolean>(false);
    readonly closeSidebar = output<void>();

    public openDropdowns = signal<Set<string>>(new Set());

    public menuItems: SidebarItem[] = [
        {
            label: 'Ministerio Infantil',
            icon: 'pi pi-users',
            route: '/kids'
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
