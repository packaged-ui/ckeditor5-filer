import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from "@ckeditor/ckeditor5-link/src/link";
import Image from "@ckeditor/ckeditor5-image/src/image";
import Filer from "../src/filer";

document.addEventListener('DOMContentLoaded', function ()
{
  ClassicEditor.create(
    document.getElementById('layout-example'),
    {
      filer: {url: '/filer.php'},
      plugins: [Essentials, Bold, Link, Italic, Paragraph, Image, Filer],
      toolbar: ['bold', 'italic', 'link', 'filer'],
      language: 'en'
    }
  );
});
