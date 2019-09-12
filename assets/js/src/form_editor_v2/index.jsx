import React from 'react';
import { render } from '@wordpress/element';
import { Editor, initBlocks } from './editor.jsx';

const appElement = document.querySelector('#mailpoet_form_editor_v2');

if (appElement) {
  initBlocks();
  render(
    <Editor />,
    document.querySelector('#mailpoet_form_editor_v2')
  );
}
