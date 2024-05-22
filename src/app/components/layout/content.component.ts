import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  standalone: true,
  template: `
    <div class="content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        flex-grow: 1;
        overflow: hidden;
      }

      .content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
      }
    `,
  ],
})
export class ContentComponent {}
