import { Component } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class ContainerComponent {}
