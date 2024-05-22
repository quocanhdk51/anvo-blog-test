import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EditorStoreProvider } from '../providers';
import { map } from 'rxjs';

export const PreviewGuard: CanActivateFn = () => {
  return inject(EditorStoreProvider).html$.pipe(
    map((html) => !!html || inject(Router).createUrlTree(['/editor']))
  );
};
