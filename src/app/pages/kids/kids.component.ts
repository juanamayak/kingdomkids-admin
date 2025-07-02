import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {KidsService} from "../../services/kids.service";
import {AlertsService} from "../../services/alerts.service";
import {Table, TableModule} from "primeng/table";
import {DatePipe} from "@angular/common";
import {Button, ButtonModule} from "primeng/button";
import {Popover, PopoverModule} from "primeng/popover";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {SelectModule} from "primeng/select";
import {KidsAges} from "../../constants/kids-ages";
import {Router} from "@angular/router";
import moment, {unix} from "moment";
import {FormsModule} from "@angular/forms";

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
    providers: [AlertsService],
    templateUrl: './kids.component.html',
    styleUrl: './kids.component.scss'
})
export class KidsComponent implements OnInit {

    @ViewChild('kidsDt') table: any | undefined;

    private kidsService = inject(KidsService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);

    public kidsAges = KidsAges;

    public kids: any;
    public allergyKids: number[] = [];
    public medicalConditionKids: number[] = [];
    public mdfMembers: number[] = [];

    public selectedAge: number = 0;

    public isDownloading: boolean = false;

    ngOnInit() {
        this.getKids();
    }

    getKids() {
        this.kidsService.getKids().subscribe({
            next: data => {
                this.kids = data.kids;
                this.allergyKids = this.kids.filter((kid: any) => kid.allergy === 1);
                this.medicalConditionKids = this.kids.filter((kid: any) => kid.medical_condition === 1);
                this.mdfMembers = this.kids.filter((kid: any) => kid.mdf_member === 1);
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    getExcelReport(){
        this.isDownloading = true;
        this.kidsService.getKidsAgeReport(this.selectedAge).subscribe({
            next: data => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(data)
                link.download = `Report-${moment().unix()}.xlsx`;
                link.click();

                this.isDownloading = false;
            },
            error: err => {
                this.isDownloading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    public viewKidInformation(kid: any){
        localStorage.setItem(this.kidsService.kidToken, btoa(JSON.stringify(kid)));
        this.router.navigate(['/kids/detail']);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.table?.filterGlobal(filterValue, 'contains');
    }

    clearFilter() {
        this.table?.clear();
        this.selectedAge = 0;
    }

    filterByAge(event: any): void {
        const age = event.value;
        this.table?.filterGlobal(age, 'contains');
    }

}
