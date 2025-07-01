import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {PopoverModule} from "primeng/popover";
import {InputTextModule} from "primeng/inputtext";
import {Router, RouterLink} from "@angular/router";
import {SessionService} from "../../../services/session.service";
import {AlertsService} from "../../../services/alerts.service";

@Component({
    selector: 'app-navbar',
    imports: [
        ButtonModule,
        MenuModule,
        PopoverModule,
        InputTextModule
    ],
    providers: [AlertsService],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

    private router = inject(Router)
    public items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Menu',
                items: [
                    {
                        label: 'Cerrar sesión',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            sessionStorage.clear();
                            this.router.navigate(['auth/login']);
                        }
                    }
                ]
            }
        ];
    }
}
