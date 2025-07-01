import {Component, inject, OnInit} from '@angular/core';
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {PopoverModule} from "primeng/popover";
import {TableModule} from "primeng/table";
import {TableSkeletonComponent} from "../../../shared/components/skeleton/table-skeleton/table-skeleton.component";
import {ToastModule} from "primeng/toast";
import {MenuModule} from "primeng/menu";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import {SkeletonModule} from "primeng/skeleton";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";
import {ContractsService} from "../../../services/contracts.service";
import {AlertsService} from "../../../services/alerts.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-trash-contracts',
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
    templateUrl: './trash-contracts.component.html',
    styleUrl: './trash-contracts.component.scss'
})
export class TrashContractsComponent implements OnInit {
    private contractsService = inject(ContractsService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);

    public contracts: any;
    public isLoading: boolean = false;

    ngOnInit() {
        this.getTrashContracts();
    }

    private getTrashContracts() {
        this.isLoading = true;
        this.contractsService.getContractsByStatus('trash').subscribe({
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

    public viewContractDetails(contract: any) {
        localStorage.setItem(this.contractsService.contractToken, btoa(JSON.stringify(contract)));
        this.router.navigate(['/contracts/detail']);
    }

    public viewClientInformation(contract: any){
        localStorage.setItem(this.contractsService.contractToken, btoa(JSON.stringify(contract)));
        this.router.navigate(['/contracts/client']);
    }
}
