import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertsService} from "../../services/alerts.service";
import {SessionService} from "../../services/session.service";
import moment from "moment";

@Component({
    selector: 'app-change-password',
    imports: [
        ReactiveFormsModule,
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

    @Input() expired: boolean;
    @Input() first: boolean;
    @Input() uuid: string;

    private route = inject(ActivatedRoute);
    private sessionService = inject(SessionService);
    private formBuilder = inject(FormBuilder);
    private alertsService = inject(AlertsService);

    public passwordForm: any;

    public currentYear = moment().format('YYYY');
    public showPassword = false;

    ngOnInit(): void {
        this.initPasswordForm();
    }

    initPasswordForm(){
        this.passwordForm = this.formBuilder.group({
            password: ['', Validators.required],
            confirm_password: ['', Validators.required],
        })
    }

    changePassword(){
        const data = this.passwordForm.value;
        this.sessionService.changePassword(this.uuid, data).subscribe({
            next: res => {
                this.sessionService.logout()
            },
            error: err => {
            }
        })
    }

    onShowPassword(){
        this.showPassword = !this.showPassword;
    }
}
