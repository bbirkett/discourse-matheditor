import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { getOwner } from 'discourse-common/lib/get-owner';
import { apiInitializer } from 'discourse/lib/api';
import loadScript from 'discourse/lib/load-script';
import showModal from 'discourse/lib/show-modal';
import I18n from 'I18n';

export default apiInitializer('0.11.1', (api) => {
  loadScript(settings.theme_uploads.mathlive);

  // Ensure keyboard is tunred off when the modal is closed
  api.onAppEvent('modal:body-dismissed', function () {
    const controller = getOwner(this).lookup('controller:matheditor-modal');
    if (!controller.toolbarEvent || !controller.toolbarEvent.mathfield) {
      return;
    }
    controller.toolbarEvent.mathfield.$perform('hideVirtualKeyboard');
  });

  api.modifyClass('controller:composer', {
    pluginId: 'math-editor',

    @action
    showMathEditor(event) {
      showModal('matheditor-modal').set('toolbarEvent', event);

      later(
        this,
        () => {
          event.mathfield = MathLive.makeMathField('mathfield', {
            virtualKeyboardMode: 'manual',
          });
          event.mathfield.$perform('showVirtualKeyboard');
        },
        50
      );
    },
  });

  const composerController = api.container.lookup('controller:composer');

  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: 'math-editor',
      group: 'extras',
      icon: 'square-root-alt',
      sendAction: (event) => composerController.send('showMathEditor', event),
      title: themePrefix('insert_equation'),
    });
  });
});
