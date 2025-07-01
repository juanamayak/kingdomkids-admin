import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet
    ],
    styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
