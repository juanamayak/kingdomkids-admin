import {Component, inject, OnInit} from '@angular/core';
import {KidsService} from "../../services/kids.service";
import {AlertsService} from "../../services/alerts.service";
import {TableModule} from "primeng/table";
import {DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {Popover} from "primeng/popover";

@Component({
    selector: 'app-kids',
    imports: [
        TableModule,
        DatePipe,
        Button,
        Popover
    ],
    providers: [AlertsService],
    templateUrl: './kids.component.html',
    styleUrl: './kids.component.scss'
})
export class KidsComponent implements OnInit {

    private kidsService = inject(KidsService);
    private alertsService = inject(AlertsService);

    public kids: any;

    ngOnInit() {
        this.getKids();
    }

    getKids() {
        this.kidsService.getKids().subscribe({
            next: data => {
                this.kids = data.kids;
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

}
