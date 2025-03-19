import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {definePreset} from '@primeng/themes';
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f4f4f4",
      100: "#cac9c9",
      200: "#a09f9f",
      300: "#777474",
      400: "#4d4a4a",
      500: "#231f1f",
      600: "#1e1a1a",
      700: "#191616",
      800: "#131111",
      900: "#0e0c0c",
      950: "#090808"
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: { darkModeSelector: false },
      },
    }),
  ],
};
