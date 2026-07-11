import {inject, Injectable} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AlertsService {

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    successAlert(message: string) {
        return Swal.fire({
            title: '¡Proceso exitoso!',
            text: message,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            customClass: {
                popup: 'rounded-xl',
                container: 'pt-0',
                confirmButton: 'text-white bg-emerald-600 rounded-lg px-3 py-2 text-center mr-2',
            },
            buttonsStyling: false,
            heightAuto: false,
        });
    }

    errorAlert(messages: { message: string }[]) {
        const msg = messages.map(m => m.message).join(', ');

        Swal.fire({
            title: 'Ups, algo salió mal',
            text: msg,
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            customClass: {
                popup: 'rounded-xl',
                container: 'pt-0',
                confirmButton: 'text-white bg-red-500 rounded-lg px-3 py-2 text-center',
            },
            buttonsStyling: false,
            heightAuto: false,
        });
    }

    confirmRequest(message: string, event?: Event): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.confirmationService.confirm({
                target: event?.target as EventTarget,
                message,
                header: 'Confirmación',
                icon: 'pi pi-question-circle',
                rejectButtonProps: {
                    label: 'Cancelar',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Continuar',
                },
                accept: () => { observer.next(true); observer.complete(); },
                reject: () => { observer.error(false); observer.complete(); },
            });
        });
    }

    confirmDeleteRequest(message: string, event?: Event): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.confirmationService.confirm({
                target: event?.target as EventTarget,
                message,
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-circle',
                rejectButtonProps: {
                    label: 'Cancelar',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Eliminar',
                    severity: 'danger',
                },
                accept: () => { observer.next(true); observer.complete(); },
                reject: () => { observer.error(false); observer.complete(); },
            });
        });
    }
}

