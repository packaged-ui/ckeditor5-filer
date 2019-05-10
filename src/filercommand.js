import Command from "@ckeditor/ckeditor5-core/src/command";
import Filer from "@packaged-ui/filer/src/filer";
import Modal from "@packaged-ui/modal/src/modal";

import './style.css';

export default class FilerCommand extends Command
{
  constructor(editor)
  {
    super(editor);

    this.modal = new Modal();

    let filerConfig = editor.config.get('filer') || {};
    filerConfig.container = this.modal.content;
    filerConfig.itemSelected = (item) =>
    {
      if(item.mime.indexOf('image/') > -1)
      {
        this.insertImage(item);
      }
      else
      {
        this.insertLink(item);
      }
    };
    this.filer = new Filer(filerConfig);

    // Remove default document listener to lower its priority.
    this.stopListening(this.editor.model.document, 'change');

    // Lower this command listener priority to be sure that refresh() will be called after link & image refresh.
    this.listenTo(this.editor.model.document, 'change', () => this.refresh(), {priority: 'lowest'});
  }

  refresh()
  {
    const imageCommand = this.editor.commands.get('imageInsert');
    const linkCommand = this.editor.commands.get('link');

    // The filer command is enabled when one of imageInsert or link command is enabled.
    this.isEnabled = (imageCommand && imageCommand.isEnabled) || (linkCommand && linkCommand.isEnabled);
  }

  execute()
  {
    this.modal.show();
  }

  insertLink(item)
  {
    const cmd = this.editor.commands.get('link');

    // Check if inserting an image is actually possible - it might be possible to only insert a link.
    if(!cmd.isEnabled)
    {
      const notification = this.editor.plugins.get('Notification');

      notification.showWarning(
        'Could not insert link at the current position.',
        {
          title: 'Inserting image failed',
          namespace: 'filer'
        }
      );

      return;
    }
    cmd.execute(item.url);
    this.modal.remove();
  }

  insertImage(item)
  {
    const cmd = this.editor.commands.get('imageInsert');

    // Check if inserting an image is actually possible - it might be possible to only insert a link.
    if(!cmd.isEnabled)
    {
      const notification = this.editor.plugins.get('Notification');

      notification.showWarning(
        'Could not insert image at the current position.',
        {
          title: 'Inserting image failed',
          namespace: 'filer'
        }
      );

      return;
    }
    cmd.execute({source: [item.url]});
    this.modal.remove();
  }
}
