import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ContractsService} from "../../../services/contracts.service";
import {DevelopersService} from "../../../services/developers.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertsService} from "../../../services/alerts.service";
import {Location} from "@angular/common";
import {CurrencyTypes} from "../../../constants/currency-types";
import {InputTextModule} from "primeng/inputtext";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {SelectModule} from "primeng/select";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {forkJoin, lastValueFrom} from "rxjs";
import {LocationsService} from "../../../services/locations.service";
import {Languages} from "../../../constants/languages";
import {ClientsService} from "../../../services/clients.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableModule} from "primeng/table";

@Component({
    selector: 'app-clients-information',
    imports: [
        ButtonModule,
        InputTextModule,
        NgxIntlTelInputModule,
        ReactiveFormsModule,
        SelectModule,
        ToggleSwitchModule,
        ConfirmDialogModule,
        TableModule
    ],
    providers: [AlertsService],
    templateUrl: './clients-information.component.html',
    styleUrl: './clients-information.component.scss'
})
export class ClientsInformationComponent implements OnInit {
    public updateClientsForm: any;

    private contractsService = inject(ContractsService);
    private clientsService = inject(ClientsService);
    private developersService = inject(DevelopersService);
    private locationService = inject(LocationsService);
    private formBuilder = inject(FormBuilder);
    private alertsService = inject(AlertsService);
    private location = inject(Location);

    public contract: any;

    public developers: any;
    public emails: any;
    public telephones: any;
    public currency = CurrencyTypes;

    public countries: any;
    public states: any;
    public cities: any;

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
            countries: this.locationService.getCountries(),
            emails: this.clientsService.getClientEmails(this.contract.Client.uuid),
            telephones: this.clientsService.getClientTelephones(this.contract.Client.uuid)
        }).subscribe({
            next: ({developers, countries, emails, telephones}) => {
                this.developers = developers.developers;
                this.emails = emails.emails;
                this.telephones = telephones.telephones;
                this.countries = this.reorderCountries(['US', 'CA', 'MX'], countries.countries);
                this.initUpdateClientsForm();
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    async initUpdateClientsForm() {
        const country = this.countries.find((country: any) => this.contract.Client.country.toLowerCase() === country.name.toLowerCase());

        await this.getStates({value: country.id});
        const state = this.states.find((state: any) => this.contract.Client.state.toLowerCase() === state.name.toLowerCase());

        await this.getCities({value: state.id});
        const city = this.cities.find((city: any) => this.contract.Client.city.toLowerCase() === city.name.toLowerCase());

        this.updateClientsForm = this.formBuilder.group({
            name: [this.contract.Client.name, Validators.required],
            lastname: [this.contract.Client.lastname, Validators.required],
            country: [country.id, Validators.required],
            state: [state.id, Validators.required],
            city: [city.id, Validators.required],
            zip: [this.contract.Client.zip, Validators.required],
            address: [this.contract.Client.address, Validators.required],
            language: [this.contract.Client.language, Validators.required]
        });

        this.updateClientsForm.disable()
    }

    updateClientInfo() {
        this.alertsService.confirmRequest(
            'Please confirm that you would like to update the client info?',
            event
        ).subscribe({
            next: res => {
                this.isUpdating = true;

                const country = this.countries.find((country: any) => country.id === this.updateClientsForm.value.country);
                const state = this.states.find((state: any) => state.id === this.updateClientsForm.value.state);
                const city = this.cities.find((city: any) => city.id === this.updateClientsForm.value.city);

                const data = {
                    name: this.updateClientsForm.value.name,
                    lastname: this.updateClientsForm.value.lastname,
                    country: country.name.toUpperCase(),
                    state: state.name.toUpperCase(),
                    city: city.name.toUpperCase(),
                    zip: this.updateClientsForm.value.zip,
                    address: this.updateClientsForm.value.address,
                    language: this.updateClientsForm.value.language
                };
                this.clientsService.updateClient(this.contract.Client.uuid, data).subscribe({
                    next: res => {
                        this.isUpdating = false;
                        this.updateClientsForm.disable();
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

    private reorderCountries(code: any, countries: any) {
        for (let i = 0; i < code.length; i++) {
            const index = countries.findIndex((x: any) => x.code === code[i]);
            const country = countries.find((x: any) => x.code === code[i]);
            countries.splice(index, 1);
            countries.unshift(country);
        }
        return countries;
    }

    public async getStates(event: any) {
        const countryId = event.value;

        try {
            const res = await lastValueFrom(this.locationService.getStates(countryId));
            this.states = res.states;
        } catch (err: any) {
            this.alertsService.errorAlert(err.error.errors);
        }
    }

    public async getCities(event: any) {
        const stateId = event.value;

        try {
            const res = await lastValueFrom(this.locationService.getCities(stateId));
            this.cities = res.cities;
        } catch (err: any) {
            this.alertsService.errorAlert(err.error.errors);
        }
    }

    enableUpdateClientsForm(event: any) {
        if (event.checked) {
            this.updateClientsForm.enable();
        } else {
            this.updateClientsForm.disable()
        }
    }

    goBack() {
        localStorage.removeItem(this.contractsService.contractToken);
        this.location.back();
    }

    protected readonly languages = Languages;
}
