import {AfterViewInit, Component, signal} from '@angular/core';
import {NavbarComponent} from "../../shared/components/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../../shared/components/sidebar/sidebar.component";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
    selector: 'app-main-layout',
    imports: [
        NavbarComponent,
        RouterOutlet,
        SidebarComponent,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

    public isMobile: boolean;

    hideSideMenu = signal(true);

    toogleSideMenu() {
        this.hideSideMenu.update(prevState => !prevState);
    }

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }

}
