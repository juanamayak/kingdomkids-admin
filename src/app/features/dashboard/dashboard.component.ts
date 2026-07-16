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

    public kpiCards = computed<KpiCard[]>(() => {
        const kidsData = this.kids() ?? [];
        const checkinsData = this.todayCheckins() ?? [];

        return [
            {
                label: 'Niños registrados',
                value: kidsData.length,
                icon: 'pi pi-users',
                color: 'bg-sky-50 text-sky-600',
                route: '/kids'
            },
            {
                label: 'Check-ins hoy',
                value: checkinsData.length,
                icon: 'pi pi-calendar-clock',
                color: 'bg-emerald-50 text-emerald-600',
                route: '/kids/checkins'
            },
            {
                label: 'Con alergias',
                value: kidsData.filter((k: Kid) => k.allergy === 1).length,
                icon: 'pi pi-exclamation-triangle',
                color: 'bg-amber-50 text-amber-600',
                route: '/kids'
            },
            {
                label: 'Condición médica',
                value: kidsData.filter((k: Kid) => k.medical_condition === 1).length,
                icon: 'pi pi-heart',
                color: 'bg-red-50 text-red-600',
                route: '/kids'
            },
            {
                label: 'Miembros MDF',
                value: kidsData.filter((k: Kid) => k.mdf_member === 1).length,
                icon: 'pi pi-star',
                color: 'bg-violet-50 text-violet-600',
                route: '/kids'
            },
        ];
    });

    ngOnInit(): void {
        this.loadKids();
        this.loadTodayCheckins();
    }

    private loadKids(): void {
        this.kidsService.getKids().subscribe({
            next: (data: { kids: Kid[] }) => this.kids.set(data.kids ?? []),
            error: (err: { error?: { errors?: { message: string }[] } }) => {
                this.kids.set([]);
                this.alertsService.errorAlert(err.error?.errors ?? [{ message: 'Error al cargar niños' }]);
            }
        });
    }

    private loadTodayCheckins(): void {
        this.checkinService.getTodayCheckins().subscribe({
            next: (data: { checkins: CheckinRecord[] }) => this.todayCheckins.set(data.checkins ?? []),
            error: () => this.todayCheckins.set([])
        });
    }

    public getKidInitials(checkin: CheckinRecord): string {
        if (!checkin.kid?.name) {
            return checkin.kid_id.toString();
        }
        const firstInitial = checkin.kid.name.charAt(0).toUpperCase();
        const lastInitial = checkin.kid.lastname ? checkin.kid.lastname.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    public getKidFullName(checkin: CheckinRecord): string {
        if (!checkin.kid?.name) {
            return `Niño #${checkin.kid_id}`;
        }
        return `${checkin.kid.name} ${checkin.kid.lastname || ''}`.trim();
    }
}



