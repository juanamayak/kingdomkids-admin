import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {PopoverModule} from 'primeng/popover';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import moment from 'moment';
import {KidsService, Kid} from '../../services/kids.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {KidsAges} from '../../../../core/constants/kids-ages';

@Component({
    selector: 'app-kids',
    imports: [
        TableModule,
        DatePipe,
        ButtonModule,
        InputIconModule,
        InputTextModule,
        IconFieldModule,
        PopoverModule,
        SelectModule,
        FormsModule
    ],
    templateUrl: './kids.component.html',
    styleUrl: './kids.component.scss'
})
export class KidsComponent implements OnInit {

    @ViewChild('kidsDt') table: Table | undefined;

    private kidsService = inject(KidsService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);

    public kidsAges = KidsAges;
    public kids = signal<Kid[]>([]);
    public allergyKids = signal<Kid[]>([]);
    public medicalConditionKids = signal<Kid[]>([]);
    public mdfMembers = signal<Kid[]>([]);
    public selectedAge = signal<number>(0);
    public isDownloading = signal(false);

    ngOnInit(): void {
        this.getKids();
    }

    getKids(): void {
        this.kidsService.getKids().subscribe({
            next: data => {
                this.kids.set(data.kids);
                this.allergyKids.set(data.kids.filter(k => k.allergy === 1));
                this.medicalConditionKids.set(data.kids.filter(k => k.medical_condition === 1));
                this.mdfMembers.set(data.kids.filter(k => k.mdf_member === 1));
            },
            error: err => this.alertsService.errorAlert(err.error?.errors ?? [{ message: 'Error al cargar niños' }])
        });
    }

    getExcelReport(): void {
        this.isDownloading.set(true);
        this.kidsService.getKidsAgeReport(this.selectedAge()).subscribe({
            next: data => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(data);
                link.download = `Reporte-${moment().unix()}.xlsx`;
                link.click();
                this.isDownloading.set(false);
            },
            error: err => {
                this.isDownloading.set(false);
                this.alertsService.errorAlert(err.error?.errors ?? [{ message: 'Error al descargar reporte' }]);
            }
        });
    }

    viewKidInformation(kid: Kid): void {
        localStorage.setItem(this.kidsService.kidToken, btoa(JSON.stringify(kid)));
        this.router.navigate(['/kids/detail']);
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.table?.filterGlobal(filterValue, 'contains');
    }

    clearFilter(): void {
        this.table?.clear();
        this.selectedAge.set(0);
    }

    filterByAge(event: { value: number }): void {
        this.table?.filterGlobal(event.value, 'contains');
    }
}

