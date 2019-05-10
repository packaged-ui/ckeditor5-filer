import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import FilerIcon from "./filer.svg";

const FILER = 'filer';

export default class FilerUI extends Plugin
{
  init()
  {
    const editor = this.editor;
    const t = editor.t;

    // Add bold button to feature components.
    editor.ui.componentFactory.add(
      FILER, locale =>
      {
        const command = editor.commands.get(FILER);
        const btn = new ButtonView(locale);

        btn.set(
          {
            label: t('Filer'),
            icon: FilerIcon,
            tooltip: true
          }
        );

        btn.bind('isEnabled').to(command);

        // Execute command.
        this.listenTo(btn, 'execute', () => editor.execute(FILER));

        return btn;
      }
    );
  }
}
