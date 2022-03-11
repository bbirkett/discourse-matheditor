import Controller from '@ember/controller';
import { action } from '@ember/object';

export default Controller.extend({
  @action
  insertEq() {
    this.toolbarEvent.addText(
      '$$\n' + this.toolbarEvent.mathfield.$text('latex-expanded') + '\n$$'
    );
    this.send('closeModal');
  },
});
