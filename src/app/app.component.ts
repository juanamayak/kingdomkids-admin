import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BrandService} from './core/services/brand.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    private brandService = inject(BrandService);

    ngOnInit(): void {
        this.brandService.init();
    }
}
