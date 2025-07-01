import {Component, inject, Input, OnInit} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {FileUploadModule} from "primeng/fileupload";
import {ConfirmDialog} from "primeng/confirmdialog";
import {SkeletonModule} from "primeng/skeleton";
import {ToastModule} from "primeng/toast";
import moment from "moment/moment";
import {FilesService} from "../../../../services/files.service";
import {SignaturesService} from "../../../../services/signatures.service";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlertsService} from "../../../../services/alerts.service";
import {DomSanitizer} from "@angular/platform-browser";
import {SignaturePadComponent} from "../../signature-pad/signature-pad.component";

@Component({
  selector: 'app-sign-contracts-dialog',
    imports: [
        ToolbarModule,
        ButtonModule,
        FileUploadModule,
        SkeletonModule,
        ToastModule,
        SignaturePadComponent
    ],
  templateUrl: './sign-contracts-dialog.component.html',
  styleUrl: './sign-contracts-dialog.component.scss'
})
export class SignContractsDialogComponent implements OnInit {


    private filesService = inject(FilesService);
    private signaturesService = inject(SignaturesService);
    private alertsService = inject(AlertsService);
    private sanitizer = inject(DomSanitizer);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);

    public contractUuid: string;

    public pdfUrl: any;
    public pdfLib: any;
    public safeUrl: any;
    public currentPage: any;
    public pdfCanvas: any;
    public pdfContext: any;
    public pdfDoc: any;

    public isSmallDivice: any;
    public initialScale: any;
    public scale: any;

    public pageNumPending = false;
    public pageRendering = false;

    public pageNum = 1;
    public scaledBy = 0.5;

    public token: any;
    public isSigned: any;
    public pdfBlob: any;

    public isLoading: boolean = false;

    ngOnInit() {

        this.contractUuid = this.dialogConfig.data.contractUuid;

        this.pdfLib = (window as any)['pdfjs-dist/build/pdf'];

        this.pdfLib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/build/pdf.worker.js';

        this.pdfCanvas = document.getElementById('pdf-viewer') as HTMLCanvasElement;
        this.pdfContext = this.pdfCanvas.getContext('2d');

        this.previewDocument();

        this.currentPage = 1;

        this.isSmallDivice = window.innerWidth <= 1024;
        this.initialScale = 1.1;
        this.scale = this.initialScale;
    }


    previewDocument() {
        this.isLoading = true;
        this.filesService.generatePDFContract(this.contractUuid).subscribe({
            next: data => {
                this.pdfBlob = data;
                this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(data));
                this.safeUrl = this.pdfUrl.changingThisBreaksApplicationSecurity;
                this.pdfLib.getDocument(this.safeUrl).promise.then((pdfDoc: any) => {
                    this.pdfDoc = pdfDoc;
                    this.renderPage(1);
                    this.isLoading = false; // Ocultar el cargando al terminar de renderizar
                }).catch((err: any) => {
                    console.log(err);
                    this.isLoading = false; // Ocultar si hay error cargando el PDF
                });
            },
            error: err => {
                console.log(err);
                this.isLoading = false; // Ocultar si falla el servicio
            }
        })
    }

    public captureSignature(data: any) {
        this.alertsService.confirmRequest(`Please confirm that you would like to sign and authorize this contract?`).subscribe({
            next: res => {
                this.signaturesService.captureSignature(this.contractUuid, data).subscribe({
                    next: result => {
                        this.previewDocument();
                        this.uploadContract();
                    },
                    error: err => {
                        this.alertsService.errorAlert(err.error.errors);
                    }
                });
            }
        })
    }

    uploadContract() {
        const file = this.blobToPdfConverter();
        let formData = new FormData();
        formData.append('file', file);

        this.filesService.uploadPDFFiles(this.contractUuid, formData, 'contract').subscribe({
            next: res => {
                this.alertsService.successAlert(res.message).then(result => {
                    if (result.isConfirmed){
                        this.dialogRef.close(true);
                    }
                });
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    blobToPdfConverter() {
        this.pdfBlob.name = moment().unix() + '.pdf';
        this.pdfBlob.lastModified = new Date();

        return new File([this.pdfBlob], 'BBCTR-12345.pdf', {
            type: this.pdfBlob.type,
        });
    }

    renderPage(num: any, zoom?: any) {
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then(async (page: any) => {
            const viewport = page.getViewport({scale: (zoom) ? zoom : this.scale});
            this.pdfCanvas.height = viewport.height;
            this.pdfCanvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: this.pdfContext,
                viewport
            };
            const renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(() => {
                if (this.pageNumPending) {
                    // New page rendering is pending
                    this.renderPage(this.pageNumPending);
                    this.pageNumPending = false;
                }
            });
        });
    }

    zoomIn() {
        if (!this.pdfDoc) {
            return;
        }
        this.scale += this.scaledBy;
        this.renderPage(this.pageNum);
    }

    zoomOut() {
        if (!this.pdfDoc) {
            return;
        }
        this.scale -= this.scaledBy;
        this.renderPage(this.pageNum);
    }

    resetZoom() {
        if (!this.pdfDoc) {
            return;
        }
        this.scale = this.initialScale;
        this.renderPage(this.pageNum);
    }

    prevPage() {
        if (this.pageNum <= 1) {
            return;
        }

        this.pageNum--;
        this.queueRenderPage(this.pageNum);
    }

    queueRenderPage(num: any) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            this.renderPage(num);
        }
    }

    nextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }

        this.pageNum++;
        this.queueRenderPage(this.pageNum);
    }
}
