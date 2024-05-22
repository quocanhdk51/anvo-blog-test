import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorStoreProvider {
  private readonly _html$ = new BehaviorSubject<string | null>(null);
  readonly html$ = this._html$.asObservable();

  setHtml(html: string | null) {
    this._html$.next(html);
  }
}
