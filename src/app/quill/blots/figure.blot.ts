import { BlockEmbed } from 'quill/blots/block';

export interface FigureBlotValue {
  src?: string;
  alt?: string;
}

export class FigureBlot extends BlockEmbed {
  static override blotName = 'figure';
  static override className = 'ql-figure';
  static override tagName = 'img';

  static override create(value: FigureBlotValue) {
    const node = super.create() as HTMLImageElement;
    if (value.alt) {
      node.setAttribute('alt', value.alt || '');
    }
    if (value.src) {
      node.setAttribute('src', value.src);
    }

    return node;
  }

  static override value(domNode: HTMLElement) {
    const img = domNode as HTMLImageElement;

    return {
      src: img.src,
      alt: img.alt,
    };
  }

  override format(name: string, value: unknown): void {
    if (name === 'size') {
      switch (value) {
        case 'small':
          this.domNode.classList.add('ql-size-small');
          break;
        case 'large':
          this.domNode.classList.add('ql-size-large');
          break;
        case 'full':
          this.domNode.classList.add('ql-size-full');
          break;
        default:
          this.domNode.classList.remove('ql-size-small');
          break;
      }
    } else {
      super.format(name, value);
    }
  }
}
