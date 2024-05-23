import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerQuill } from './app/quill';

registerQuill();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
