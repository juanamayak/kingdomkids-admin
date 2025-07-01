import {Component, inject, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {MenuModule} from "primeng/menu";
import {ButtonModule} from "primeng/button";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";
import {ToolbarModule} from "primeng/toolbar";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {SkeletonModule} from "primeng/skeleton";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";
import {ContractsService} from "../../../services/contracts.service";
import {AlertsService} from "../../../services/alerts.service";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {PopoverModule} from "primeng/popover";
import {TableSkeletonComponent} from "../../../shared/components/skeleton/table-skeleton/table-skeleton.component";
import {Router} from "@angular/router";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";


@Component({
    selector: 'app-created-contracts',
    imports: [
        TableModule,
        ToastModule,
        ButtonModule,
        MenuModule,
        ToggleSwitchModule,
        ToolbarModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        SkeletonModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        ProgressBarModule,
        CurrencyPipe,
        PopoverModule,
        DatePipe,
        TableSkeletonComponent
    ],
    providers: [AlertsService, DialogService],
    templateUrl: './created-contracts.component.html',
    styleUrl: './created-contracts.component.scss'
})
export class CreatedContractsComponent implements OnInit {

    private contractsService = inject(ContractsService);
    private alertsService = inject(AlertsService);
    private dialogService = inject(DialogService);
    private router = inject(Router);

    public contracts: any;
    public isLoading: boolean = false;
    public isAuhtorizing: boolean = false;
    public isDeleting: boolean = false;
    public dialogRef: DynamicDialogRef | undefined;

    ngOnInit() {
        this.getCreatedContracts();
    }

    private getCreatedContracts() {
        this.isLoading = true;
        this.contractsService.getContractsByStatus('created').subscribe({
            next: data => {
                this.isLoading = false;
                this.contracts = data.contracts;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    public authorizeContracts(contractUuid: string, event: Event) {
        this.alertsService.confirmRequest(
            'Please confirm that you would like to authorize this contract?',
            event
        ).subscribe({
            next: data => {
                this.isAuhtorizing = true;
                this.contractsService.authorizeContract(contractUuid).subscribe({
                    next: res => {
                        this.isAuhtorizing = false;
                        this.alertsService.successAlert(res.message).then(result => {
                            if (result.isConfirmed){
                                this.router.navigate(['/contracts/authorized']);
                            }
                        });
                    },
                    error: err => {
                        this.isAuhtorizing = false;
                        this.alertsService.errorAlert(err.error.errors);
                    }
                })
            }
        });
    }

    public sendToTrash(contractUuid: string) {
        this.alertsService.confirmDeleteRequest(
            'Please confirm that you would like to delete this contract?'
        ).subscribe({
            next: data => {
                this.isDeleting = true;
                this.contractsService.sendContractToTrash(contractUuid).subscribe({
                    next: res => {
                        this.isDeleting = false;
                        this.alertsService.successAlert(res.message).then(result => {
                            if (result.isConfirmed){
                                this.router.navigate(['/contracts/trash']);
                            }
                        });
                    },
                    error: err => {
                        this.isDeleting = false;
                        this.alertsService.errorAlert(err.error.errors);
                    }
                })
            },
        })
    }

    public viewContractDetails(contract: any) {
        localStorage.setItem(this.contractsService.contractToken, btoa(JSON.stringify(contract)));
        this.router.navigate(['/contracts/detail']);
    }

    public viewClientInformation(contract: any){
        localStorage.setItem(this.contractsService.contractToken, btoa(JSON.stringify(contract)));
        this.router.navigate(['/contracts/client']);
    }

}
