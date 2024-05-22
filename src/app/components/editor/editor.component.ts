import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  importProvidersFrom,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  ContentChange,
  EditorChangeContent,
  EditorChangeSelection,
  QuillEditorComponent,
  QuillModule,
} from 'ngx-quill';
import Block from 'quill/blots/block';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Range } from 'quill';
import { Subscription } from 'rxjs';

const toBase64 = (file: File) =>
  new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

@Component({
  selector: 'app-editor',
  imports: [
    QuillModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  readonly html = input<string | null>(null);
  readonly editor = viewChild('editor', { read: QuillEditorComponent });

  readonly fileUpload = viewChild('fileUpload', {
    read: ElementRef<HTMLInputElement>,
  });

  readonly contentChanged = output<string | null>();
  readonly subscription = new Subscription();

  readonly sidebarOpen = signal(false);
  readonly sidebarPosition = signal<{
    left: number;
    top: number;
  } | null>(null);

  private _range: Range = { index: 0, length: 0 };

  onEditorCreated() {
    const editor = this.editor();
    const html = this.html();

    if (!editor) {
      return;
    }

    if (editor.quillEditor) {
      const delta = editor.quillEditor.clipboard.convert({
        html: html || '',
      });

      editor.quillEditor.setContents(delta, 'silent');
      editor.quillEditor.setSelection(this._range);
    }
  }

  toggleSideBar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  addImage() {
    const fileUpload = this.fileUpload();

    if (!fileUpload) {
      return;
    }

    fileUpload.nativeElement.click();
  }

  async onFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (!file) {
      return;
    }

    const url = await toBase64(file);
    if (typeof url !== 'string') {
      return;
    }

    const editor = this.editor();

    if (!editor) {
      return;
    }

    editor.quillEditor.insertEmbed(this._range.index, 'image', url);
  }

  onEditorChange(event: EditorChangeContent | EditorChangeSelection) {
    this.sidebarOpen.set(false);

    if (event.event !== 'selection-change') {
      return;
    }

    if (!event.range) {
      return;
    }

    this._range = event.range;

    if (event.range.length === 0) {
      const [block] = event.editor.scroll.descendant(Block, event.range?.index);

      if (block && block.domNode.firstChild instanceof HTMLBRElement) {
        const lineBounds = event.editor.getBounds(event.range);
        if (!lineBounds) {
          return;
        }

        const { left } = event.editor.container.getBoundingClientRect();

        this.sidebarPosition.set({
          left: left - 36,
          top: lineBounds.top + 9,
        });
      } else {
        this.sidebarPosition.set(null);
      }
    } else {
      this.sidebarPosition.set(null);
    }
  }

  onContentChanged(event: ContentChange) {
    this.contentChanged.emit(event.html);
  }
}
