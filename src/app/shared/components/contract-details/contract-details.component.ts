import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe, Location} from '@angular/common';
import {ContractsService} from "../../../services/contracts.service";
import {TimelineModule} from "primeng/timeline";
import {ChipModule} from "primeng/chip";
import {ContractStatus} from "../../../constants/contract-status";
import {FilesService} from "../../../services/files.service";
import {AlertsService} from "../../../services/alerts.service";
import {InputTextModule} from "primeng/inputtext";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {forkJoin} from "rxjs";
import {DevelopersService} from "../../../services/developers.service";
import {InputNumber} from "primeng/inputnumber";
import {CurrencyTypes} from "../../../constants/currency-types";
import {DatePicker} from "primeng/datepicker";
import moment from "moment";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {ConfirmDialog} from "primeng/confirmdialog";

@Component({
    selector: 'app-contract-details',
    imports: [
        ButtonModule,
        TimelineModule,
        ChipModule,
        InputTextModule,
        DatePipe,
        NgxIntlTelInputModule,
        ReactiveFormsModule,
        Select,
        InputNumber,
        ToggleSwitchModule,
        DatePicker,
        ConfirmDialog
    ],
    providers: [AlertsService],
    templateUrl: './contract-details.component.html',
    styleUrl: './contract-details.component.scss'
})
export class ContractDetailsComponent implements OnInit {

    public updateContractsForm: any;

    private contractsService = inject(ContractsService);
    private developersService = inject(DevelopersService);
    private formBuilder = inject(FormBuilder);
    private filesService = inject(FilesService);
    private alertsService = inject(AlertsService);
    private location = inject(Location);

    public contract: any;
    public contractStatus = ContractStatus;

    public developers: any;
    public currency = CurrencyTypes;

    public isDownloading: boolean = false;
    public isUpdating: boolean = false;

    ngOnInit() {
        const contractToken: any = localStorage.getItem(this.contractsService.contractToken);
        this.contract = JSON.parse(atob(contractToken));

        console.log(this.contract);

        this.loadingInitialData();
    }

    loadingInitialData() {
        forkJoin({
            developers: this.developersService.getDevelopers(),
        }).subscribe({
            next: ({developers}) => {
                this.developers = developers.developers;
                this.initUpdateContractForm();
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    initUpdateContractForm() {
        this.updateContractsForm = this.formBuilder.group({
            developer_uuid: [this.contract.Developer.uuid, Validators.required],
            contract: [this.contract.contract, Validators.required],
            membership_price: [this.contract.membership_price, Validators.required],
            property_description: [this.contract.property_description],
            currency: [this.contract.currency, Validators.required],
            sign_date: [new Date(this.contract.sign_date), Validators.required],
            charge_date: [new Date(this.contract.charge_date), Validators.required],
        });

        this.updateContractsForm.disable()
    }

    updateContract() {
        this.alertsService.confirmRequest(
            'Please confirm that you would like to update the contract?',
            event
        ).subscribe({
            next: res => {
                this.isUpdating = true;

                const data = {
                    developer_uuid: this.updateContractsForm.value.developer_uuid,
                    contract: this.updateContractsForm.value.contract,
                    membership_price: this.updateContractsForm.value.membership_price.toString(),
                    currency: this.updateContractsForm.value.currency,
                    property_description: this.updateContractsForm.value.property_description,
                    sign_date: moment(this.updateContractsForm.value.sign_date).format("YYYY-MM-DD"),
                    charge_date: moment(this.updateContractsForm.value.charge_date).format("YYYY-MM-DD"),
                };

                this.contractsService.updateContract(this.contract.uuid, data).subscribe({
                    next: res => {
                        this.isUpdating = false;
                        this.updateContractsForm.disable();
                        this.alertsService.successAlert(res.message).then(result => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    },
                    error: err => {
                        this.isUpdating = false;
                        this.alertsService.errorAlert(err.error.errors);
                    }
                });
            }
        });
    }

    public downloadContract() {
        this.isDownloading = true;
        this.filesService.downloadPDFContract(this.contract.uuid, 'contract').subscribe({
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

    enableUpdateContractForm(event: any) {
        if (event.checked) {
            this.updateContractsForm.enable();
        } else {
            this.updateContractsForm.disable()
        }
    }

    goBack() {
        localStorage.removeItem(this.contractsService.contractToken);
        this.location.back();
    }

}
