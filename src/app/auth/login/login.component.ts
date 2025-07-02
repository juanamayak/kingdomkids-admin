import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SessionService} from "../../services/session.service";
import {AlertsService} from "../../services/alerts.service";
import {Router} from "@angular/router";
import moment from "moment";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule
    ],
    providers: [ConfirmationService, MessageService, AlertsService],
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup;

    private sessionService = inject(SessionService);
    private alertsService = inject(AlertsService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);

    public currentYear = moment().format('YYYY');

    public isLoading = false;

    ngOnInit() {
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onLogin() {
        this.isLoading = true;
        const data = this.loginForm.value;

        this.sessionService.login(data).subscribe({
            next: res => {
                const token = res.token;
                sessionStorage.setItem(this.sessionService.jwtToken, token);

                this.router.navigate(['kids']);

                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        })
    }
}
