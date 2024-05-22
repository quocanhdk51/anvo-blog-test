import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EditorComponent } from '../../components/editor';
import { ContainerComponent, ContentComponent } from '../../components/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { EditorStoreProvider } from '../../providers';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    EditorComponent,
    ContainerComponent,
    ContentComponent,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
  ],
  selector: 'app-editor-page',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorPage {
  readonly editorStore = inject(EditorStoreProvider);

  onContentChanged(html: string | null) {
    this.editorStore.setHtml(html);
  }
}
