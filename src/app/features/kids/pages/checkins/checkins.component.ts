import {Component, ViewChild, computed, inject, OnInit, signal} from '@angular/core';
import {CheckinService, CheckinRecord} from '../../services/checkin.service';
import {KidsService, Kid} from '../../services/kids.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {TagModule} from 'primeng/tag';
import {Table} from 'primeng/table';

export interface CheckinRow extends CheckinRecord {
    kidName: string;
}

@Component({
    selector: 'app-checkins',
    imports: [DatePipe, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, TagModule],
    templateUrl: './checkins.component.html',
    styleUrl: './checkins.component.scss'
})
export class CheckinsComponent implements OnInit {

    @ViewChild('kidsDt') table: Table | undefined;

    private checkinService = inject(CheckinService);
    private kidsService = inject(KidsService);
    private alertsService = inject(AlertsService);

    public checkins = signal<CheckinRecord[]>([]);
    public kids = signal<Kid[]>([]);
    public isLoading = signal(true);
    public today = new Date();

    public rows = computed<CheckinRow[]>(() => {
        const kidsMap = new Map(this.kids().map((k: Kid) => [k.id, `${k.name} ${k.lastname}`]));
        return this.checkins().map((c: CheckinRecord) => ({
            ...c,
            kidName: kidsMap.get(c.kid_id) ?? `Niño #${c.kid_id}`
        }));
    });

    public present = computed(() => this.rows().filter((r: CheckinRow) => !r.checkout_date).length);
    public exited = computed(() => this.rows().filter((r: CheckinRow) => !!r.checkout_date).length);

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.kidsService.getKids().subscribe({
            next: (data: { kids: Kid[] }) => {
                this.kids.set(data.kids);
                this.loadCheckins();
            },
            error: () => this.loadCheckins()
        });
    }

    private loadCheckins(): void {
        this.checkinService.getTodayCheckins().subscribe({
            next: (data: { checkins: CheckinRecord[] }) => {
                this.checkins.set(data.checkins);
                this.isLoading.set(false);
            },
            error: (err: { error?: { errors?: { message: string }[] } }) => {
                this.isLoading.set(false);
                this.alertsService.errorAlert(err.error?.errors ?? [{ message: 'Error al cargar check-ins' }]);
            }
        });
    }

    refresh(): void {
        this.isLoading.set(true);
        this.loadCheckins();
    }
}
