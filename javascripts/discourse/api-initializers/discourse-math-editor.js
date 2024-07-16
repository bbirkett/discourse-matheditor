import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { getOwner } from 'discourse-common/lib/get-owner';
import { apiInitializer } from 'discourse/lib/api';
import loadScript from 'discourse/lib/load-script';
import { inject as service } from "@ember/service";
import MathEditorModal from "../components/modal/math-editor-modal";
import I18n from 'I18n';

export default apiInitializer('0.11.1', (api) => {
  loadScript(settings.theme_uploads.mathlive);

  api.modifyClass('component:d-editor', {
    pluginId: 'math-editor',
    modal: service(),

    @action
    showMathEditor(toolbarEvent) {
      this.modal.show(MathEditorModal, {
        model: {  toolbarEvent: toolbarEvent }
      });

      later(
        this,
        () => {
          toolbarEvent.mathfield = MathLive.makeMathField('mathfield', {
            virtualKeyboardMode: 'manual',
          });
          toolbarEvent.mathfield.$perform('showVirtualKeyboard');
        },
        50
      );
    },
  });

  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: 'math-editor',
      group: 'extras',
      icon: 'square-root-alt',
      sendAction: (event) =>  toolbar.context.send('showMathEditor', event),
      title: themePrefix('insert_equation'),
    });
  });
});
