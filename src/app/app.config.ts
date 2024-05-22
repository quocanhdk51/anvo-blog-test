import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { QuillModule } from 'ngx-quill';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      QuillModule.forRoot({
        theme: 'bubble',
        placeholder: 'Start writing something awesome...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['blockquote', 'code-block'],
            [{ size: ['small', 'normal', 'large', 'huge'] }],
            ['link'], // link and image, video
          ],
        },
      })
    ),
    provideAnimationsAsync(),
  ],
};
