import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PopoverModule} from "primeng/popover";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {MenuModule} from "primeng/menu";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import {SkeletonModule} from "primeng/skeleton";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";
import {AlertsService} from "../../../services/alerts.service";
import {ContractsService} from "../../../services/contracts.service";
import {Router, RouterLink} from "@angular/router";
import {TableSkeletonComponent} from "../../../shared/components/skeleton/table-skeleton/table-skeleton.component";

@Component({
    selector: 'app-authorized-contracts',
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
    providers: [AlertsService],
    templateUrl: './authorized-contracts.component.html',
    styleUrl: './authorized-contracts.component.scss'
})
export class AuthorizedContractsComponent implements OnInit {
    private contractsService = inject(ContractsService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);

    public contracts: any;
    public isLoading: boolean = false;
    public isSending: boolean = false;
    public isDeleting: boolean = false;

    ngOnInit() {
        this.getAuthorizedContracts();
    }

    private getAuthorizedContracts() {
        this.isLoading = true;
        this.contractsService.getContractsByStatus('authorized').subscribe({
            next: data => {
                this.isLoading = false;
                this.contracts = data.contracts;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    public sendToBuyBack(contractUuid: string, event: Event) {
        this.alertsService.confirmRequest(
            'Please confirm that you would like to send this contract to BuyBack?',
            event
        ).subscribe({
            next: res => {
                this.isSending = true;
                this.contractsService.sendContractToBuyBack(contractUuid).subscribe({
                    next: res => {
                        this.isLoading = false;
                        this.alertsService.successAlert(res.message).then(result => {
                            if (result.isConfirmed){
                                this.router.navigate(['/contracts/sent']);
                            }
                        });
                    },
                    error: err => {
                        this.isLoading = false;
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

    public viewContractDocumentation(contract: any){
        localStorage.setItem(this.contractsService.contractToken, btoa(JSON.stringify(contract)));
        this.router.navigate(['/contracts/documentation', contract.uuid]);
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
