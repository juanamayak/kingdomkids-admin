import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-sidebar',
    imports: [
        RouterLink
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    @Input() hideSideMenu: boolean;
}
