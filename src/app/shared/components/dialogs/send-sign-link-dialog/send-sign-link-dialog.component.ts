import {Component, inject, OnInit} from '@angular/core';
import {SelectModule} from "primeng/select";
import {ClientsService} from "../../../../services/clients.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertsService} from "../../../../services/alerts.service";
import {ButtonModule} from "primeng/button";
import {LinksService} from "../../../../services/links.service";

@Component({
    selector: 'app-send-sign-link-dialog',
    imports: [
        SelectModule,
        ButtonModule,
        ReactiveFormsModule
    ],
    providers: [AlertsService],
    templateUrl: './send-sign-link-dialog.component.html',
    styleUrl: './send-sign-link-dialog.component.scss'
})
export class SendSignLinkDialogComponent implements OnInit {

    private clientsService = inject(ClientsService);
    private linksService = inject(LinksService);
    private formBuilder = inject(FormBuilder);
    private alertsService = inject(AlertsService);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);

    public contactTypes: any[] = [{name: 'Telephone', value: 'phone'}, {name: 'Email', value: 'email'}];

    public sendLinkForm: FormGroup;

    public contractUuid: string;
    public clientUuid: string;
    public contactType: any;
    public telephones: any;
    public emails: any;

    public isLoading: boolean = false;
    public isSending: boolean = false;

    ngOnInit() {
        this.clientUuid = this.dialogConfig.data.clientUuid;
        this.contractUuid = this.dialogConfig.data.contractUuid;

        this.initSendLinkForm();
    }

    initSendLinkForm(): void {
        this.sendLinkForm = this.formBuilder.group({
            contact_type: ['', Validators.required],
            phone: [''],
            email: [''],
        });
    }


    onContactTypeChange(event: any): void {
        this.contactType = event.value;
        if (this.contactType === 'phone') {
            this.getTelephones();
        } else if (this.contactType === 'email') {
            this.getEmails();
        }
    }

    getTelephones() {
        this.isLoading = true;
        this.clientsService.getClientTelephones(this.clientUuid).subscribe({
            next: data => {
                this.telephones = data.telephones;
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    getEmails() {
        this.isLoading = true;
        this.clientsService.getClientEmails(this.clientUuid).subscribe({
            next: data => {
                this.emails = data.emails;
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    sendLinkByTelephone() {
        this.isSending = true;
        const data = {
            telephone: this.sendLinkForm.value.phone
        }

        this.linksService.sendLinkByTelephone(this.contractUuid, data).subscribe({
            next: data => {
                this.isSending = false;
                this.alertsService.successAlert(data.message).then( res => {
                    if (res.isConfirmed){
                        this.dialogRef.close(true);
                    }
                })
            },
            error: err => {
                this.isSending = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    sendLinkByEmail() {
        this.isSending = true;
        const data = {
            email: this.sendLinkForm.value.email
        }

        this.linksService.sendLinkByEmail(this.contractUuid, data).subscribe({
            next: data => {
                this.isSending = false;
                this.alertsService.successAlert(data.message).then( res => {
                    if (res.isConfirmed){
                        this.dialogRef.close(true);
                    }
                })
            },
            error: err => {
                this.isSending = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }


}
