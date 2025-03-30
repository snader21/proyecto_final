import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-global-confirm',
    standalone: true,
    imports: [CommonModule, ConfirmDialogModule, ButtonModule],
    template: `
    <p-confirmDialog>
      <ng-template #headless let-message>
        <div class="flex flex-col w-[400px] gap-4 p-5">
          <div class="flex gap-2">
            <i [ngClass]="message.icon" class="!text-2xl" [class]="getIconColor(message.icon)"></i>
            <span class="text-lg font-semibold">{{ message.header }}</span>
          </div>
          <p class="text-md">{{ message.message }}</p>
          <div class="flex justify-end gap-2 mt-4">
            <p-button label="Aceptar" styleClass="bg-slate-700 text-white" (click)="message.accept()"></p-button>
          </div>
        </div>
      </ng-template>
    </p-confirmDialog>
  `
})
export class GlobalConfirmComponent {
    getIconColor(icon: string): string {
        if (icon.includes('check')) {
            return 'text-green-600';
        } else if (icon.includes('times')) {
            return 'text-red-600';
        } else if (icon.includes('exclamation')) {
            return 'text-yellow-600';
        } else if (icon.includes('info')) {
            return 'text-blue-600';
        } else {
            return 'text-blue-600';
        }
    }
} 