import {Component, inject, Input, OnInit} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {FilesService} from "../../../services/files.service";
import {AlertsService} from "../../../services/alerts.service";
import {ConfirmDialog} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import { FileUploadModule} from "primeng/fileupload";
import {SkeletonModule} from "primeng/skeleton";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {
    SignContractsDialogComponent
} from "../../../shared/components/dialogs/sign-contracts-dialog/sign-contracts-dialog.component";
import {MessageModule} from "primeng/message";
import {ContractsService} from "../../../services/contracts.service";
import {Location} from "@angular/common";
import {PanelModule} from "primeng/panel";
import {
    SendSignLinkDialogComponent
} from "../../../shared/components/dialogs/send-sign-link-dialog/send-sign-link-dialog.component";

@Component({
    selector: 'app-documentation-contracts',
    imports: [
        ToolbarModule,
        ButtonModule,
        FileUploadModule,
        ConfirmDialog,
        SkeletonModule,
        MessageModule,
        ToastModule,
        PanelModule
    ],
    providers: [AlertsService, DialogService],
    templateUrl: './documentation-contracts.component.html',
    styleUrl: './documentation-contracts.component.scss'
})
export class DocumentationContractsComponent implements OnInit {

    @Input() contractUuid: string;


    private filesService = inject(FilesService);
    private dialogService = inject(DialogService);
    private alertsService = inject(AlertsService);
    private contractsService = inject(ContractsService);
    private location = inject(Location);

    private dialogRef: DynamicDialogRef | undefined;

    public contract: any;

    public showAttatchContract: boolean = false;
    public isUploading: boolean = false;
    public isDownloading: boolean = false;
    public fileUploaded: any = false;

    public selectedFiles: any[] = [];

    ngOnInit() {
        this.fileUploaded = localStorage.getItem('fileUploaded');
        const contractToken: any = localStorage.getItem(this.contractsService.contractToken);
        this.contract = JSON.parse(atob(contractToken));
    }

    openSignContractDialog() {
        this.dialogRef = this.dialogService.open(SignContractsDialogComponent, {
            data: {
                contractUuid: this.contractUuid
            },
            header: 'Sign Contract',
            width: '80vw',
            closeOnEscape: false,
            modal: true,
            closable: true,
            maximizable: true,
            baseZIndex: 1,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });

        this.dialogRef.onClose.subscribe((result) => {
            if (result) {
                this.fileUploaded = true;
                localStorage.setItem('fileUploaded', this.fileUploaded);
            }
        });
    }

    openSendSignLinkDialog() {
        this.dialogRef = this.dialogService.open(SendSignLinkDialogComponent, {
            data: {
                contractUuid: this.contractUuid,
                clientUuid: this.contract.Client.uuid
            },
            header: 'Send Sign Link',
            width: '20vw',
            closeOnEscape: false,
            modal: true,
            closable: true,
            baseZIndex: 1,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });

        this.dialogRef.onClose.subscribe((result) => {
            if (result) {
                this.goBack();
            }
        });
    }


    downloadFormat() {
        this.isDownloading = true;
        this.filesService.generatePDFContract(this.contractUuid).subscribe({
            next: data => {
                this.isDownloading = false;
                const file = URL.createObjectURL(data)
                window.open(file, '_blank');
            },
            error: err => {
                this.isDownloading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }


    onUpload(event: any) {
        this.isUploading = true;

        this.selectedFiles = event.files;
        let formData = new FormData();

        for (const file of this.selectedFiles) {
            formData.append('file', file);
        }

        this.filesService.uploadPDFFiles(this.contractUuid, formData, 'contract').subscribe({
            next: res => {
                this.isUploading = false;
                this.fileUploaded = true;
                this.alertsService.successAlert(res.message);
                localStorage.setItem('fileUploaded', this.fileUploaded);
            },
            error: err => {
                this.isUploading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    goBack() {
        localStorage.removeItem(this.contractsService.contractToken);
        localStorage.removeItem('fileUploaded');
        this.location.back();
    }
}
