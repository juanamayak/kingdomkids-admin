import {inject, Injectable} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import Swal from 'sweetalert2';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AlertsService {

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    constructor() {
    }

    /*successAlert(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Successfull process!',
            detail: message,
            sticky: true
        });
    }*/

    successAlert(message: string) {
        const confirmation = Swal.fire({
            title: 'Successful process!',
            text: message,
            icon: 'success',
            confirmButtonText: 'Finish',
            allowOutsideClick: false,
            customClass: {
                popup: 'rounded-xl',
                container: 'pt-0',
                confirmButton: 'text-white bg-green-600 rounded-lg px-3 py-2 text-center mr-2',
            },
            buttonsStyling: false,
            heightAuto: false,
        });

        return confirmation;
    }

    errorAlert(messages: any) {
        let msg;
        messages.forEach((m: any) => {
            msg = m.message;
        });

        Swal.fire({
            title: 'Ups, something went wrong',
            text: msg,
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            customClass: {
                popup: 'rounded-xl',
                confirmButton:
                    'text-white bg-red-500 rounded-lg px-3 py-2 text-center',
            },
            buttonsStyling: false,
            heightAuto: false,
        });
    }


    /*errorAlert(errors: any): void {
        for (const error of errors) {
            this.messageService.addAll([{
                severity: 'error',
                summary: 'Ups, something went wrong!',
                detail: error.message,
                sticky: true
            }]);
        }
    }*/


    confirmRequest(message: string, event?: Event): Observable<any> {
        return new Observable<boolean>(observer => {
            this.confirmationService.confirm({
                target: event?.target as EventTarget,
                message,
                header: 'Confirmation',
                icon: 'pi pi-question-circle',
                rejectLabel: 'Cancel',
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Continue',
                    severity: 'pimary',
                },
                accept: () => {
                    observer.next(true);
                    observer.complete();
                },
                reject: () => {
                    observer.error(false);
                    observer.complete();
                },
            });
        })
    }

    confirmDeleteRequest(message: string, event?: Event): Observable<any> {
        return new Observable<boolean>(observer => {
            this.confirmationService.confirm({
                target: event?.target as EventTarget,
                message,
                header: 'Require confirmation',
                icon: 'pi pi-exclamation-circle',
                rejectLabel: 'Cancel',
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Confirm',
                    severity: 'danger',
                },
                accept: () => {
                    observer.next(true);
                    observer.complete();
                },
                reject: () => {
                    observer.error(false);
                    observer.complete();
                },
            });
        })
    }


}
