import Block, { BlockEmbed } from 'quill/blots/block';

export class CaptionBlot extends Block {
  static override blotName = 'caption';
  static override tagName = 'figcaption';
  static override className = 'ql-caption';

  static override create(value: string): HTMLElement {
    const node = super.create() as HTMLElement;
    node.innerHTML = value;
    return node;
  }

  override update(
    mutations: MutationRecord[],
    context: { [key: string]: any }
  ): void {
    console.log(mutations, context);
    super.update(mutations, context);
  }
}
