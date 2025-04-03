import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export type AlertType = 'success' | 'error' | 'warn' | 'info';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private readonly confirmationService: ConfirmationService,
  ) {}

  showAlert(type: AlertType, title: string, message: string) {
    const icon = this.getIcon(type);

    this.confirmationService.confirm({
      message: message,
      header: title,
      icon: icon,
      accept: () => {
        this.confirmationService.close();
      },
      reject: () => {}
    });
  }

  private getIcon(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      case 'info':
        return 'pi pi-info-circle';
      default:
        return 'pi pi-info-circle';
    }
  }
} 