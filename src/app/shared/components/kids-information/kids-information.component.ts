import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DatePipe, Location } from '@angular/common';
import { KidsService } from '../../../features/kids/services/kids.service';
import { AlertsService } from '../../../core/services/alerts.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Parent {
    type: string;
    full_name: string;
    email: string;
    cellphone: string;
}

interface AuthorizedPerson {
    relationship: string;
    full_name: string;
    cellphone: string;
}

export interface KidDetail {
    id: number;
    name: string;
    lastname: string;
    birthday: string;
    age: number;
    address: string;
    allergy: number;
    allergy_description: string;
    medical_condition: number;
    medical_condition_description: string;
    mdf_member: number;
    another_church_name: string;
    invited: number;
    invite_name: string;
    qr_code: string;
    parents: Parent[];
    authorized: AuthorizedPerson[];
}

@Component({
    selector: 'app-kids-information',
    imports: [ButtonModule, DatePipe],
    providers: [AlertsService],
    templateUrl: './kids-information.component.html',
    styleUrl: './kids-information.component.scss'
})
export class KidsInformationComponent implements OnInit {

    @ViewChild('qrImg') qrImg!: ElementRef<HTMLImageElement>;

    private kidsService = inject(KidsService);
    private alertsService = inject(AlertsService);
    private location = inject(Location);

    public kid = signal<KidDetail>({} as KidDetail);
    public qr = signal<string>('');
    public isLoading = signal<boolean>(false);

    public initials = computed(() => this.getInitials(`${this.kid().name} ${this.kid().lastname}`));

    ngOnInit(): void {
        const kidToken = localStorage.getItem(this.kidsService.kidToken);
        if (kidToken) {
            this.kid.set(JSON.parse(atob(kidToken)) as KidDetail);
            this.getKidInformation();
        }
    }

    getKidInformation(): void {
        this.kidsService.getConfirmationRegister(this.kid().id).subscribe({
            next: data => this.qr.set(data.qr),
            error: err => this.alertsService.errorAlert(err.error.errors),
        });
    }

    public getInitials(fullName: string): string {
        return fullName
            .split(' ')
            .slice(0, 2)
            .map(n => n.charAt(0).toUpperCase())
            .join('');
    }

    public generatePDF(): void {
        this.isLoading.set(true);
        html2canvas(this.qrImg.nativeElement).then(() => {
            const PDF = new jsPDF('p', 'mm', [105, 148]);
            const imgData = 'data:image/jpeg;base64,' + this.qr();

            PDF.setFillColor(30, 144, 255);
            PDF.rect(0, 0, 105, 20, 'F');
            PDF.setTextColor(255, 255, 255);
            PDF.setFontSize(14);
            PDF.text(`KINGDOM KIDS ${new Date().getFullYear()}`, 52.5, 10, { align: 'center' });
            PDF.setFontSize(10);
            PDF.text('20 AL 24 DE JULIO', 52.5, 16, { align: 'center' });

            let y = 25;
            PDF.setTextColor(0, 0, 0);
            PDF.setFontSize(8);
            PDF.text('Edades: 5 a 11 años', 10, y);
            PDF.text('Horario: Lun-Vie 09:00-13:00', 10, y + 4);
            PDF.text('Entrada: Calle 78 Nte Lote 001, esq. Diag. 65 y Av. 28 de Julio', 10, y + 8);
            PDF.text('EVENTO GRATUITO', 10, y + 12);

            y += 20;
            PDF.setTextColor(30, 144, 255);
            PDF.setFontSize(9);
            PDF.text('¿QUÉ DEBEN TRAER?', 10, y);

            PDF.setTextColor(0, 0, 0);
            PDF.setFontSize(7);
            PDF.text('- Lunch y botella con nombre', 12, y + 4);
            PDF.text('- Lunch por separado si son hermanos', 12, y + 7);
            PDF.text('- Tenis y ropa cómoda', 12, y + 10);

            y += 18;
            PDF.setTextColor(255, 69, 0);
            PDF.setFontSize(9);
            PDF.text('IMPORTANTE', 10, y);

            PDF.setTextColor(0, 0, 0);
            const importanteText = 'Si presenta síntomas (gripa, tos, fiebre), debe quedarse en casa. Avísanos sobre alergias o condiciones.';
            const lines = PDF.splitTextToSize(importanteText, 85);
            PDF.text(lines, 10, y + 4);

            y = y + 4 + (lines.length * 3) + 5;
            PDF.addImage(imgData, 'JPEG', 32.5, y, 40, 40);

            y = y + 45;
            PDF.setTextColor(0, 128, 0);
            PDF.setFontSize(9);
            PDF.text('GRAN CLAUSURA: SÁB 25 JUL, 7PM', 52.5, y, { align: 'center' });
            PDF.text('¡Para toda la familia!', 52.5, y + 5, { align: 'center' });

            y = y + 12;
            PDF.setFontSize(7);
            PDF.setTextColor(0, 0, 0);
            PDF.text('¡Apóyanos donando una bolsa de dulces!', 10, y);
            PDF.text('Entrégalos en el área de registro.', 10, y + 4);

            PDF.save(`${this.kid().name}_QR.pdf`);
            this.isLoading.set(false);
        });
    }

    goBack(): void {
        localStorage.removeItem(this.kidsService.kidToken);
        this.location.back();
    }
}
