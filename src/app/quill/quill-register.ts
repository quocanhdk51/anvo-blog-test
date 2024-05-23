import Quill from 'quill';
import { CaptionBlot, FigureBlot } from './blots';

export function registerQuill() {
  Quill.register(CaptionBlot);
  Quill.register(FigureBlot);
}
