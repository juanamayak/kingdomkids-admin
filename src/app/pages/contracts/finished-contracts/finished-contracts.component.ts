import {Component, inject, OnInit} from '@angular/core';
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import {SkeletonModule} from "primeng/skeleton";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {PopoverModule} from "primeng/popover";
import {TableSkeletonComponent} from "../../../shared/components/skeleton/table-skeleton/table-skeleton.component";
import {AlertsService} from "../../../services/alerts.service";
import {ContractsService} from "../../../services/contracts.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-finished-contracts',
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
    templateUrl: './finished-contracts.component.html',
    styleUrl: './finished-contracts.component.scss'
})
export class FinishedContractsComponent implements OnInit {
    private contractsService = inject(ContractsService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);

    public contracts: any;
    public isLoading: boolean = false;
    public isDeleting: boolean = false;

    ngOnInit() {
        this.getFinishedContracts();
    }

    private getFinishedContracts() {
        this.isLoading = true;
        this.contractsService.getContractsByStatus('finalized').subscribe({
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
                                this.getFinishedContracts();
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
