import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
  SelectionChange,
} from 'ngx-quill';
import Block, { BlockEmbed } from 'quill/blots/block';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Range } from 'quill';
import { Subscription } from 'rxjs';
import { FigureBlot, FigureBlotValue } from '../../quill/blots';
import { toBase64 } from '../../utils';

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

  readonly toolBarMode = signal<'figure' | 'default'>('default');
  private _selectedFigure: FigureBlot | null = null;

  private _range: Range = { index: 0, length: 0 };

  onEditorCreated() {
    const editor = this.editor();
    const html = this.html();

    if (!editor) {
      return;
    }

    if (editor.quillEditor) {
      console.log(html);

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

    const figureValue: FigureBlotValue = {
      src: url,
      alt: file.name,
    };

    editor.quillEditor.insertEmbed(this._range.index, 'figure', figureValue);
    editor.quillEditor.insertEmbed(
      this._range.index + 1,
      'caption',
      'Image Caption'
    );
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
    console.log(event);
    this.contentChanged.emit(event.html);
  }

  onSelectionChanged(event: SelectionChange) {
    const range = event.range;

    if (!range) {
      return;
    }

    const [block] = event.editor.scroll.descendant(BlockEmbed, range.index);
    if (block && block instanceof FigureBlot) {
      this.toolBarMode.set('figure');
      this._selectedFigure = block;
    } else {
      this.toolBarMode.set('default');
      this._selectedFigure = null;
    }
  }

  onFigureSizeChange(size: 'small' | 'large' | 'full') {
    if (!this._selectedFigure) {
      return;
    }

    this._selectedFigure.format('size', size);
  }
}
