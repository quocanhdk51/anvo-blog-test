import { Routes } from '@angular/router';
import { PreviewGuard } from './guards';

export const routes: Routes = [
  {
    path: 'editor',
    loadComponent: () =>
      import('./pages/editor/editor.page').then((m) => m.EditorPage),
  },
  {
    path: 'article/preview',
    loadComponent: () =>
      import('./pages/preview/preview.page').then((m) => m.PreviewPage),
    canActivate: [PreviewGuard],
  },
  {
    path: '',
    redirectTo: 'editor',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'editor',
  },
];
