import {Component, inject, input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AlertsService} from '../../../../core/services/alerts.service';
import {SessionService} from '../../../../core/services/session.service';
import moment from 'moment';

@Component({
    selector: 'app-change-password',
    imports: [ReactiveFormsModule],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

    readonly expired = input<boolean>(false);
    readonly first = input<boolean>(false);
    readonly uuid = input<string>('');

    private sessionService = inject(SessionService);
    private formBuilder = inject(FormBuilder);
    private alertsService = inject(AlertsService);

    public passwordForm: ReturnType<FormBuilder['group']> = this.formBuilder.group({
        password: ['', Validators.required],
        confirm_password: ['', Validators.required],
    });

    public currentYear = moment().format('YYYY');
    public showPassword = false;

    ngOnInit(): void {}

    changePassword(): void {
        this.sessionService.changePassword(this.uuid(), this.passwordForm.value as { password: string; confirm_password: string }).subscribe({
            next: () => this.sessionService.logout(),
            error: err => this.alertsService.errorAlert(err.error?.errors ?? [{ message: 'Error desconocido' }])
        });
    }

    onShowPassword(): void {
        this.showPassword = !this.showPassword;
    }
}

