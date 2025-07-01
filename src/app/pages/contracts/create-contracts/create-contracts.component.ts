import {Component, inject, OnInit} from '@angular/core';
import {DevelopersService} from "../../../services/developers.service";
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectModule} from "primeng/select";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {DatePickerModule} from "primeng/datepicker";
import {InputMaskModule} from "primeng/inputmask";
import {ButtonModule} from "primeng/button";
import {ContractsService} from "../../../services/contracts.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AlertsService} from "../../../services/alerts.service";
import {LocationsService} from "../../../services/locations.service";
import {forkJoin} from "rxjs";
import moment from "moment";
import {InputNumberModule} from "primeng/inputnumber";
import {Router} from "@angular/router";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {SearchCountryField} from 'ngx-intl-tel-input';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {PhoneCodes} from "../../../constants/phone-codes";
import {CurrencyTypes} from "../../../constants/currency-types";
import {Languages} from "../../../constants/languages";

@Component({
    selector: 'app-create-contracts',
    imports: [
        ReactiveFormsModule,
        ToastModule,
        SelectModule,
        InputTextModule,
        DatePickerModule,
        InputMaskModule,
        ButtonModule,
        ConfirmDialogModule,
        InputNumberModule,
        NgxIntlTelInputModule,
        AutoCompleteModule
    ],
    providers: [AlertsService],
    templateUrl: './create-contracts.component.html',
    styleUrl: './create-contracts.component.scss'
})
export class CreateContractsComponent implements OnInit {

    private formBuilder = inject(FormBuilder);
    private contractsService = inject(ContractsService);
    private locationService = inject(LocationsService);
    private alertsService = inject(AlertsService);
    private developersService = inject(DevelopersService);
    private router = inject(Router);

    public createContractsForm: any;
    public developers: any;
    public isLoading: boolean = false;

    public countries: any;
    public states: any;
    public cities: any;

    public currency = CurrencyTypes;
    public languages = Languages;
    public phoneCodes: any;

    ngOnInit() {
        this.initCreateContractForm();
        this.loadingInitialData();
        // se reordena listado de codigo de teléfono
        this.phoneCodes = this.reorderCountries(['US', 'CA', 'MX'], PhoneCodes);
    }

    initCreateContractForm() {
        this.createContractsForm = this.formBuilder.group({
            contract: this.formBuilder.group({
                developer_uuid: ['', Validators.required],
                contract: ['', Validators.required],
                membership_price: ['', Validators.required],
                currency: ['', Validators.required],
                property_description: ['', Validators.required],
                sign_date: ['', Validators.required],
                charge_date: ['', Validators.required],
            }),
            client: this.formBuilder.group({
                name: ['', Validators.required],
                lastname: ['', Validators.required],
                country: ['', Validators.required],
                state: ['', Validators.required],
                city: ['', Validators.required],
                zip: ['', Validators.required],
                address: ['', Validators.required],
                language: ['', Validators.required]
            }),
            emails: this.formBuilder.array([]),
            telephones: this.formBuilder.array([]),
        });

        this.emails.push(
            this.formBuilder.group({
                email: ['', Validators.required],
            })
        );
        this.telephones.push(
            this.formBuilder.group({
                code: [''],
                telephone: ['', Validators.required],
            })
        );


    }

    loadingInitialData() {
        forkJoin({
            developers: this.developersService.getDevelopers(),
            countries: this.locationService.getCountries()
        }).subscribe({
            next: ({developers, countries}) => {
                this.developers = developers.developers;

                // se reordena el listado de paises
                /*for (const [i, country] of countries.countries.entries()) {
                    countries.countries[i].idcountry = Number(countries.countries[i].id);
                }*/
                this.countries = this.reorderCountries(['US', 'CA', 'MX'], countries.countries);

            },
            error: err => {

            }
        });
    }

    createContracts(event: Event) {
        this.alertsService.confirmRequest(
            'Please confirm that you would like to create the contract?',
            event
        ).subscribe({
            next: res => {
                this.isLoading = true;
                this.createContractsForm.disable();

                let telephones = [];

                const country = this.countries.find((country: any) => country.id === this.createContractsForm.get("client").value.country);
                const state = this.states.find((state: any) => state.id === this.createContractsForm.get("client").value.state);
                const city = this.cities.find((city: any) => city.id === this.createContractsForm.get("client").value.city);

                for (const telephone of this.createContractsForm.get("telephones").value) {
                    telephones.push({telephone: telephone.code + telephone.telephone});
                }

                const data = {
                    contract: {
                        developer_uuid: this.createContractsForm.get("contract").value.developer_uuid,
                        contract: this.createContractsForm.get("contract").value.contract,
                        membership_price: this.createContractsForm.get("contract").value.membership_price.toString(),
                        currency: this.createContractsForm.get("contract").value.currency,
                        property_description: this.createContractsForm.get("contract").value.property_description,
                        sign_date: moment(this.createContractsForm.get("contract").value.sign_date).format("YYYY-MM-DD"),
                        charge_date: moment(this.createContractsForm.get("contract").value.charge_date).format("YYYY-MM-DD"),
                    },
                    client: {
                        name: this.createContractsForm.get("client").value.name,
                        lastname: this.createContractsForm.get("client").value.lastname,
                        country: country.name.toUpperCase(),
                        state: state.name.toUpperCase(),
                        city: city.name.toUpperCase(),
                        zip: this.createContractsForm.get("client").value.zip,
                        address: this.createContractsForm.get("client").value.address,
                        language: this.createContractsForm.get("client").value.language
                    },
                    emails: this.createContractsForm.get("emails").value,
                    telephones: telephones
                };
                this.contractsService.createContract(data).subscribe({
                    next: res => {
                        this.isLoading = false;
                        this.createContractsForm.enable();
                        this.createContractsForm.reset();
                        this.alertsService.successAlert(res.message).then(result => {
                            if (result.isConfirmed) {
                                this.router.navigate(['/contracts/created']);
                            }
                        });
                    },
                    error: err => {
                        this.isLoading = false;
                        this.createContractsForm.enable();
                        this.alertsService.errorAlert(err.error.errors);
                    }
                });
            }
        });
    }

    public getDevelopers() {
        this.developersService.getDevelopers().subscribe({
            next: res => {
                this.developers = res.developers;
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }

    public getCountries() {
        this.locationService.getCountries().subscribe({
            next: res => {
                for (const [i, country] of res.countries.entries()) {
                    res.countries[i].idcountry = Number(res.countries[i].id);
                }
                this.countries = this.reorderCountries(['MX', 'CA', 'US'], res.countries);
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        })
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

    public getStates(event: any) {
        const countryId = event.value;
        this.locationService.getStates(countryId).subscribe({
            next: res => {
                this.states = res.states;
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    public getCities(event: any) {
        const stateId = event.value;
        this.locationService.getCities(stateId).subscribe({
            next: res => {
                this.cities = res.cities;
            },
            error: err => {
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }

    public addEmail() {
        return this.emails.push(
            this.formBuilder.group({
                email: ['']
            })
        );
    }

    public deleteEmail(emailIndex: number) {
        this.emails.removeAt(emailIndex);
    }

    public addTelephone() {
        this.telephones.push(
            this.formBuilder.group({
                code: [''],
                telephone: ['']
            })
        );
    }


    public deleteTelephone(telIndex: number) {
        this.telephones.removeAt(telIndex);
    }

    public filterCountry(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.phoneCodes as any[]).length; i++) {
            let country = (this.phoneCodes as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        console.log(filtered)

        this.phoneCodes = filtered;
    }

    get emails() {
        return this.createContractsForm.get("emails") as FormArray
    }

    get telephones() {
        return this.createContractsForm.get("telephones") as FormArray
    }

}
