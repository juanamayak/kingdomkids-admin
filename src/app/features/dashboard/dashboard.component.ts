import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {KidsService, Kid} from '../kids/services/kids.service';
import {CheckinService, CheckinRecord} from '../kids/services/checkin.service';
import {AlertsService} from '../../core/services/alerts.service';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

interface KpiCard {
    label: string;
    value: number;
    icon: string;
    color: string;
    route?: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, DatePipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    private kidsService = inject(KidsService);
    private checkinService = inject(CheckinService);
    private alertsService = inject(AlertsService);

    public kids = signal<Kid[]>([]);
    public todayCheckins = signal<CheckinRecord[]>([]);
    public today = new Date();

    public kpiCards = computed<KpiCard[]>(() => [
        {
            label: 'Niños registrados',
            value: this.kids().length,
            icon: 'pi pi-users',
            color: 'bg-sky-50 text-sky-600',
            route: '/kids'
        },
        {
            label: 'Check-ins hoy',
            value: this.todayCheckins().length,
            icon: 'pi pi-calendar-clock',
            color: 'bg-emerald-50 text-emerald-600',
            route: '/kids/checkins'
        },
        {
            label: 'Con alergias',
            value: this.kids().filter((k: Kid) => k.allergy === 1).length,
            icon: 'pi pi-exclamation-triangle',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            label: 'Miembros MDF',
            value: this.kids().filter((k: Kid) => k.mdf_member === 1).length,
            icon: 'pi pi-star',
            color: 'bg-violet-50 text-violet-600',
        },
    ]);

    ngOnInit(): void {
        this.loadKids();
        this.loadTodayCheckins();
    }

    private loadKids(): void {
        this.kidsService.getKids().subscribe({
            next: (data: { kids: Kid[] }) => this.kids.set(data.kids),
            error: (err: { error?: { errors?: { message: string }[] } }) =>
                this.alertsService.errorAlert(err.error?.errors ?? [{ message: 'Error al cargar niños' }])
        });
    }

    private loadTodayCheckins(): void {
        this.checkinService.getTodayCheckins().subscribe({
            next: (data: { checkins: CheckinRecord[] }) => this.todayCheckins.set(data.checkins),
            error: () => { /* silencioso si el endpoint falla */ }
        });
    }
}



