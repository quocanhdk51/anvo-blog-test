import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { QuillModule } from 'ngx-quill';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { quillConfig } from './quill';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(QuillModule.forRoot(quillConfig)),
    provideAnimationsAsync(),
  ],
};
