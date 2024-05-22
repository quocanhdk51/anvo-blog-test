import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ContainerComponent, ContentComponent } from '../../components/layout';
import { EditorStoreProvider } from '../../providers';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    ContainerComponent,
    ContentComponent,
    RouterModule,
    QuillModule,
  ],
  selector: 'app-preview-page',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPage {
  readonly editorStore = inject(EditorStoreProvider);
}
