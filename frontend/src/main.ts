import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import localeSrLatn from '@angular/common/locales/sr'; // Import Serbian locale data
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeSrLatn); // Register the Serbian locale data

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
