import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PopoverModule} from "primeng/popover";
import {TableModule} from "primeng/table";
import {ContractsService} from "../../../services/contracts.service";
import {AlertsService} from "../../../services/alerts.service";
import {ToastModule} from "primeng/toast";
import {MenuModule} from "primeng/menu";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import {SkeletonModule} from "primeng/skeleton";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";
import {TableSkeletonComponent} from "../../../shared/components/skeleton/table-skeleton/table-skeleton.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sent-contracts',
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
        TableSkeletonComponent,
    ],
    providers: [AlertsService],
    templateUrl: './sent-contracts.component.html',
    styleUrl: './sent-contracts.component.scss'
})
export class SentContractsComponent implements OnInit{

    private contractsService = inject(ContractsService);
    private router = inject(Router);
    private alertsService = inject(AlertsService);

    public contracts: any;
    public isLoading: boolean = false;
    public isDeleting: boolean = false;

    ngOnInit() {
        this.getSentContracts();
    }

    private getSentContracts() {
        this.isLoading = true;
        this.contractsService.getContractsByStatus('sent_to_buyback').subscribe({
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

    public requestCancellation(contractUuid: string) {
        this.alertsService.confirmDeleteRequest(
            'Please confirm that you would like to cancel the contract'
        ).subscribe({
            next: data => {
                this.isDeleting = true;
                this.contractsService.requestContractCancellation(contractUuid).subscribe({
                    next: res => {
                        this.isDeleting = false;
                        this.alertsService.successAlert(res.message).then(result => {
                            if (result.isConfirmed){
                                this.router.navigate(['/contracts/canceled']);
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
