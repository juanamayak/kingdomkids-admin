import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Button, ButtonModule} from "primeng/button";
import {Toolbar, ToolbarModule} from "primeng/toolbar";
import SignaturePad from "signature_pad";
import {AlertsService} from "../../../services/alerts.service";

@Component({
    selector: 'app-signature-pad',
    imports: [
        ButtonModule,
        ToolbarModule,
    ],
    providers: [AlertsService],
    templateUrl: './signature-pad.component.html',
    styleUrl: './signature-pad.component.scss'
})
export class SignaturePadComponent implements OnInit {

    private alertsService = inject(AlertsService);

    @Input() certificate: any;
    @Input() sameSignature: any;

    public signaturePad: any;
    public signatureCaptured: any;

    @ViewChild('canvas', {static: false})
    public signatureCanvas: ElementRef;

    @Output() signatureEmit = new EventEmitter();
    @Output() uploadEmit = new EventEmitter();

    ngOnInit(): void {
        this.initSignatureCanvas();
    }

    initSignatureCanvas() {
        setTimeout(() => {
            this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);
            this.signaturePad.minWidth = 1;
            this.signaturePad.maxWidth = 1;

            const canvas: any = document.getElementById('signature-canvas') as HTMLCanvasElement;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight


            if (this.certificate && this.certificate.signature_matrix) {
                const signature = JSON.parse(this.certificate.signature_matrix);
                this.signaturePad.fromData(signature);
            }
        }, 100);
    }

    emitSignature() {
        const blob = this.signaturePad.toDataURL();
        const matrix = this.signaturePad.toData();

        if (matrix.length >= 1) {
            this.signatureCaptured = {
                signature_blob: blob,
                signature_matrix: matrix,
            };

            this.signatureEmit.emit(this.signatureCaptured);
        } else {
            this.alertsService.errorAlert([{message: 'The contract cannot be sent without a signature.'}]);
        }
    }

    emitUpload() {
        this.uploadEmit.emit();
    }

    clear() {
        this.signaturePad.clear();
    }

    undo() {
        const data = this.signaturePad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            this.signaturePad.fromData(data);
        }
    }
}
