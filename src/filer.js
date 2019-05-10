import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FilerCommand from "./filercommand"
import FilerUI from "./filerui";
import UploadAdapter from "./adapter";
//import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";

export default class Filer extends Plugin
{
  static get pluginName()
  {
    return 'Filer';
  }

  /**
   * @inheritDoc
   */
  static get requires()
  {
    return [FilerUI, UploadAdapter];
  }

  init()
  {
    const editor = this.editor;

    const url = editor.config.get('filer.url');
    if(!url)
    {
      throw 'no filer url';
    }

    const cmd = new FilerCommand(editor);
    editor.commands.add('filer', cmd);

    // Register UploadAdapter
    /*editor.plugins.get(FileRepository).createUploadAdapter =
      loader => new UploadAdapter(loader, url, editor.t);*/
  }
}
