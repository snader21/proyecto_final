import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ConfirmationService, MessageService } from 'primeng/api';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    ConfirmationService,
    MessageService
  ]
}).catch(err => console.error(err));
