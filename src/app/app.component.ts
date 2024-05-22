import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { EditorComponent } from './components/editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, QuillModule, EditorComponent],
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    .container {
      height: 100%;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'text-editor';
}
