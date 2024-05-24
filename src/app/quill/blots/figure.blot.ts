import { Root } from 'parchment';
import { BlockEmbed } from 'quill/blots/block';

export interface FigureBlotValue {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ResizeContainerUpdate {
  width: number;
  height: number;
  left: number;
  top: number;
}

export class FigureBlot extends BlockEmbed {
  static override blotName = 'figure';
  static override className = 'ql-figure';
  static override tagName = 'figure';

  static override create(value: FigureBlotValue) {
    const node = super.create() as HTMLImageElement;
    const img = document.createElement('img');
    if (value.alt) {
      img.setAttribute('alt', value.alt || '');
    }

    if (value.src) {
      img.setAttribute('src', value.src);
    }

    if (value.width) {
      img.style.width = `${value.width}px`;
    }

    if (value.height) {
      img.style.height = `${value.height}px`;
    }

    node.appendChild(img);
    return node;
  }

  static override value(domNode: HTMLElement) {
    const img = domNode.querySelector('img') as HTMLImageElement;

    return {
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
    };
  }

  private readonly _resizeContainer: HTMLElement;
  private readonly _resizeTopLeftAnchor: HTMLElement;
  private readonly _resizeTopRightAnchor: HTMLElement;
  private readonly _resizeBottomLeftAnchor: HTMLElement;
  private readonly _resizeBottomRightAnchor: HTMLElement;
  private readonly _img: HTMLImageElement;

  constructor(scroll: Root, domNode: HTMLElement) {
    super(scroll, domNode);

    const img = domNode.querySelector('img');
    if (!img) {
      throw new Error('Image not found');
    }

    this._img = img;

    this._resizeContainer = document.createElement('div');
    this._resizeContainer.classList.add('ql-resize-container');
    this._resizeTopLeftAnchor = document.createElement('div');
    this._resizeTopLeftAnchor.classList.add('ql-resize-anchor');
    this._resizeTopLeftAnchor.classList.add('top-left');
    this._resizeTopRightAnchor = document.createElement('div');
    this._resizeTopRightAnchor.classList.add('ql-resize-anchor');
    this._resizeTopRightAnchor.classList.add('top-right');
    this._resizeBottomLeftAnchor = document.createElement('div');
    this._resizeBottomLeftAnchor.classList.add('ql-resize-anchor');
    this._resizeBottomLeftAnchor.classList.add('bottom-left');
    this._resizeBottomRightAnchor = document.createElement('div');
    this._resizeBottomRightAnchor.classList.add('ql-resize-anchor');
    this._resizeBottomRightAnchor.classList.add('bottom-right');

    this._resizeContainer.appendChild(this._resizeTopLeftAnchor);
    this._resizeContainer.appendChild(this._resizeTopRightAnchor);
    this._resizeContainer.appendChild(this._resizeBottomLeftAnchor);
    this._resizeContainer.appendChild(this._resizeBottomRightAnchor);

    this.domNode.appendChild(this._resizeContainer);

    this._img.addEventListener('click', this._showResizeContainer.bind(this));
    window.document.addEventListener('click', this._onWindowClick);

    this._resizeTopLeftAnchor.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const { width, height } = this._img.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = width - (e.clientX - startX);
        const newHeight = height - (e.clientY - startY);
        this._updateSize(newWidth, newHeight);
        this._updateResizeContainer();
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    this._resizeTopRightAnchor.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const { width, height } = this._img.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = width + (e.clientX - startX);
        const newHeight = height - (e.clientY - startY);
        this._updateSize(newWidth, newHeight);
        this._updateResizeContainer();
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    this._resizeBottomLeftAnchor.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const { width, height } = this._img.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = width - (e.clientX - startX);
        const newHeight = height + (e.clientY - startY);
        this._updateSize(newWidth, newHeight);
        this._updateResizeContainer();
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    this._resizeBottomRightAnchor.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const { width, height } = this._img.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = width + (e.clientX - startX);
        const newHeight = height + (e.clientY - startY);
        this._updateSize(newWidth, newHeight);
        this._updateResizeContainer();
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  private readonly _onWindowClick = (e: MouseEvent) => {
    if (!this.domNode.contains(e.target as Node)) {
      this._hideResizeContainer();
    }
  };

  private _updateSize(width: number, height: number) {
    this._img.style.width = `${width}px`;
    this._img.style.height = `${height}px`;
  }

  private _updateResizeContainer() {
    const {
      left: imageLeft,
      top: imageTop,
      width,
      height,
    } = this._img.getBoundingClientRect();
    const { left, top } = this.domNode.getBoundingClientRect();

    this._resizeContainer.style.left = `${imageLeft - left}px`;
    this._resizeContainer.style.top = `${imageTop - top}px`;
    this._resizeContainer.style.width = `${width}px`;
    this._resizeContainer.style.height = `${height}px`;
  }

  private _hideResizeContainer() {
    this._resizeContainer.classList.remove('active');
  }

  private _showResizeContainer() {
    this._resizeContainer.classList.add('active');
    this._updateResizeContainer();
  }

  override format(name: string, value: unknown): void {
    if (name === 'size') {
      switch (value) {
        case 'small':
          this._img.style.width = '50%';
          break;
        case 'large':
          this._img.style.width = '80%';
          break;
        case 'full':
          this._img.style.width = '100%';
          break;
        default:
          this._img.style.width = '50%';
          break;
      }
    } else {
      super.format(name, value);
    }
  }

  override remove(): void {
    window.document.removeEventListener('click', this._onWindowClick);
    super.remove();
  }
}
