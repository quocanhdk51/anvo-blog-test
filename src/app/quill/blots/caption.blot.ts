import Block from 'quill/blots/block';

export class CaptionBlot extends Block {
  static override blotName = 'caption';
  static override tagName = 'figcaption';
  static override className = 'ql-caption';

  static override create(value: string): HTMLElement {
    const node = super.create() as HTMLElement;
    node.innerHTML = value;

    return node;
  }
}
