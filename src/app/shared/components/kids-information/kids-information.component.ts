import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {TimelineModule} from "primeng/timeline";
import {ChipModule} from "primeng/chip";
import {InputTextModule} from "primeng/inputtext";
import {DatePipe, Location} from "@angular/common";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {ReactiveFormsModule} from "@angular/forms";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {KidsService} from "../../../services/kids.service";
import {TableModule} from "primeng/table";
import {AlertsService} from "../../../services/alerts.service";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-kids-information',
    imports: [
        ButtonModule,
        TimelineModule,
        ChipModule,
        InputTextModule,
        NgxIntlTelInputModule,
        ReactiveFormsModule,
        ToggleSwitchModule,
        TableModule,
        DatePipe,
    ],
    providers: [
        AlertsService
    ],
    templateUrl: './kids-information.component.html',
    styleUrl: './kids-information.component.scss'
})
export class KidsInformationComponent implements OnInit {

    @ViewChild('qrImg') qrImg: any;

    private kidsService = inject(KidsService);
    private alertsService = inject(AlertsService);
    private location = inject(Location);

    public kidInformation: any;
    public qr: any;

    public isLoading: boolean = false;

    ngOnInit() {
        const kidToken: any = localStorage.getItem(this.kidsService.kidToken);
        this.kidInformation = JSON.parse(atob(kidToken));

        this.getKidInformation()
    }

    getKidInformation() {
        this.kidsService.getConfirmationRegister(this.kidInformation.id).subscribe({
            next: data => {
                this.qr = data.qr;
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    public generatePDF(): void {
        this.isLoading = true;
        html2canvas(this.qrImg.nativeElement).then((canvas) => {
            const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
            let PDF = new jsPDF('p', 'mm', [105, 148]); // A6 size, ideal para móvil

            var imgData = 'data:image/jpeg;base64,' + this.qr;

            // Encabezado con fondo de color
            PDF.setFillColor(30, 144, 255); // Sky Blue
            PDF.rect(0, 0, 105, 20, 'F');
            PDF.setTextColor(255, 255, 255);
            PDF.setFontSize(14);
            PDF.text('KINGDOM KIDS 2025', 52.5, 10, { align: 'center' });
            PDF.setFontSize(10);
            PDF.text('21 AL 25 DE JULIO', 52.5, 16, { align: 'center' });

            // Contenido
            let y = 25;
            PDF.setTextColor(0, 0, 0);
            PDF.setFontSize(8);
            PDF.text('Edades: 5 a 11 años', 10, y);
            PDF.text('Horario: Lun-Vie 09:00-13:00', 10, y + 4);
            PDF.text('Entrada: Av. 35 Entre Calle 1 y 3 Sur', 10, y + 8);
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
            PDF.setTextColor(255, 69, 0); // Red-orange
            PDF.setFontSize(9);
            PDF.text('IMPORTANTE', 10, y);

            PDF.setTextColor(0, 0, 0);
            let importanteText = 'Si presenta síntomas (gripa, tos, fiebre), debe quedarse en casa. Avísanos sobre alergias o condiciones.';
            let lines = PDF.splitTextToSize(importanteText, 85);
            PDF.text(lines, 10, y + 4);

            y = y + 4 + (lines.length * 3) + 5;

            // QR centrado
            PDF.addImage(imgData, 'JPEG', 32.5, y, 40, 40);

            y = y + 45;
            PDF.setTextColor(0, 128, 0); // Green
            PDF.setFontSize(9);
            PDF.text('GRAN CLAUSURA: SÁB 26 JUL, 7PM', 52.5, y, { align: 'center' });
            PDF.text('¡Para toda la familia!', 52.5, y + 5, { align: 'center' });

            y = y + 12;
            PDF.setFontSize(7);
            PDF.setTextColor(0, 0, 0);
            PDF.text('¡Apóyanos donando una bolsa de dulces!', 10, y);
            PDF.text('Entrégalos en el área de registro.', 10, y + 4);

            PDF.save(`${this.kidInformation.name}_QR.pdf`);

            this.isLoading = false;
        });
    }

    goBack() {
        localStorage.removeItem(this.kidsService.kidToken);
        this.location.back();
    }

}
