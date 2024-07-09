import Component from '@ember/component';
import { action } from '@ember/object';

export default class MathEditorModal extends Component {
  @action
  insertEq() {
    this.model.toolbarEvent.addText(
      '$$\n' + this.model.toolbarEvent.mathfield.$text('latex-expanded') + '\n$$'
    );
    this.dismissKeyboardAndClose();
  }

  @action
  dismissKeyboardAndClose() {
    this.model.toolbarEvent.mathfield.$perform('hideVirtualKeyboard');
    this.closeModal();
  }
}
