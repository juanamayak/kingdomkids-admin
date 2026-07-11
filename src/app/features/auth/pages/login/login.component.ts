import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import moment from 'moment';
import {SessionService} from '../../../../core/services/session.service';
import {AlertsService} from '../../../../core/services/alerts.service';
import {BrandService} from '../../../../core/services/brand.service';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    public loginForm!: FormGroup;

    private sessionService = inject(SessionService);
    private alertsService = inject(AlertsService);
    private brandService = inject(BrandService);
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);

    public currentYear = moment().format('YYYY');
    public logo = this.brandService.logo;
    public projectName = this.brandService.projectName;
    public copyright = this.brandService.copyright;
    public isLoading = false;

    ngOnInit(): void {
        this.initLoginForm();
    }

    initLoginForm(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onLogin(): void {
        if (this.loginForm.invalid) return;
        this.isLoading = true;

        this.sessionService.login(this.loginForm.value).subscribe({
            next: res => {
                sessionStorage.setItem(this.sessionService.jwtToken, res.token);
                this.router.navigate(['kids']);
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.alertsService.errorAlert(err.error.errors);
            }
        });
    }
}

