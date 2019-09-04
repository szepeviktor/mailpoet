/**
 * WordPress dependencies
 */
import '@wordpress/editor'; // This shouldn't be necessary
import React from 'react';

import {
  render,
  useState,
  useEffect,
  useRef,
  Fragment,
} from '@wordpress/element';

import {
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider,
  BlockList,
  BlockInspector,
  WritingFlow,
  ObserveTyping,
} from '@wordpress/block-editor';

import {
  Button,
  Popover,
  SlotFillProvider,
  DropZoneProvider,
  Panel,
  PanelHeader,
  PanelBody,
  SelectControl,
  TextControl,
  TextareaControl,
  ToggleControl,
} from '@wordpress/components';
// import { registerCoreBlocks } from '@wordpress/block-library';
import { registerBlockType } from '@wordpress/blocks';
import * as html from '@wordpress/block-library/build-module/html';

import '@wordpress/format-library';
/**
 * Internal dependencies
 */
import MailPoet from '../mailpoet';
import * as BCMapper from './bc-mapper.jsx';
import * as submitBlock from './blocks/submit/index.jsx';
import * as inputBlock from './blocks/input/index.jsx';
import * as staticInputBlocks from './blocks/static_input/index.jsx';

const emailInput = {
  clientId: 'email',
  name: 'mailpoet-form/input-field',
  isValid: true,
  attributes: {
    label: 'E-mail',
    fieldType: 'email',
    fieldName: 'label',
  },
  innerBlocks: [],
};

const submitButton = {
  clientId: 'submit',
  name: 'mailpoet-form/submit-button',
  isValid: true,
  attributes: {
    label: 'Subscribe',
  },
  innerBlocks: [],
};

let defaultBlocks = BCMapper.getBlocks(BCMapper.formData);
if (defaultBlocks.length === 0) {
  defaultBlocks = [emailInput, submitButton];
}

function App() {
  const lists = [
    {
      value: 1,
      label: 'My First List',
    },
    {
      value: 2,
      label: 'VIP',
    },
  ];
  const [blocks, updateBlocks] = useState(defaultBlocks);
  const [formName, updateFormName] = useState(BCMapper.formData.name);
  const [formStyles, updateFormStyles] = useState(BCMapper.formData.styles || '');
  const [useLabels, updateUseLabels] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [formLists, updateFormLists] = useState([]);

  const blocksRef = useRef();

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('Current blocks');
    console.log(blocks);
    const emails = blocks.filter((block) => (block.clientId === 'email'));
    if (!emails.length) {
      // eslint-disable-next-line no-alert
      alert('Can‘t delete email');
      updateBlocks(blocksRef.current);
      return;
    }
    const submits = blocks.filter((block) => (block.clientId === 'submit'));
    if (!submits.length) {
      // eslint-disable-next-line no-alert
      alert('Can‘t delete submit button');
      updateBlocks(blocksRef.current);
      return;
    }

    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    const newBlocks = blocks.map((block) => {
      if (block.attributes.useLabels === undefined) {
        return block;
      }
      const updatedBlock = Object.assign({}, block);
      updatedBlock.attributes.useLabels = useLabels;
      return updatedBlock;
    });
    updateBlocks(newBlocks);
  }, [useLabels, blocks]);

  const save = () => {
    MailPoet.Ajax.post({
      api_version: window.mailpoet_api_version,
      endpoint: 'forms',
      action: 'saveEditor',
      data: BCMapper.getFormData(blocks, formName, formStyles),
    }).done(() => {
      MailPoet.Notice.success('Form saved.');
    }).fail((response) => {
      if (response.errors.length > 0) {
        MailPoet.Notice.error(
          response.errors.map((error) => (error.message)),
          { scroll: true }
        );
      }
    });
  };
  /* eslint-enable no-console */
  return (
    <Fragment>
      <div className="playground__body">
        <SlotFillProvider>
          <DropZoneProvider>
            <BlockEditorProvider
              value={blocks}
              onInput={updateBlocks}
              onChange={updateBlocks}
            >
              <div className="editor-styles-wrapper playground__editor mailpoet_form">
                <BlockEditorKeyboardShortcuts />
                <WritingFlow>
                  <ObserveTyping>
                    <BlockList />
                  </ObserveTyping>
                </WritingFlow>
              </div>
              <Popover.Slot />
              <div className="playground__panel">
                <Panel>
                  <PanelHeader label="Form Editor">{ formName }</PanelHeader>
                  <PanelBody title="Form Settings">
                    <TextControl label="Name" onChange={updateFormName} value={formName} />
                    <ToggleControl label="Use labels" checked={useLabels} onChange={updateUseLabels} />
                    <SelectControl label="Lists" onChange={updateFormLists} options={lists} multiple />
                    <Button isPrimary onClick={save}>Save</Button>
                  </PanelBody>
                  <PanelBody title="Block Settings">
                    <BlockInspector />
                  </PanelBody>
                  <PanelBody title="Form CSS">
                    <TextareaControl value={formStyles} onChange={updateFormStyles} />
                  </PanelBody>
                </Panel>
              </div>
            </BlockEditorProvider>
          </DropZoneProvider>
        </SlotFillProvider>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: formStyles }} />
    </Fragment>
  );
}

// registerCoreBlocks();
registerBlockType(submitBlock.name, submitBlock.settings);
registerBlockType(inputBlock.name, inputBlock.settings);
registerBlockType(staticInputBlocks.email.name, staticInputBlocks.email.settings);
registerBlockType(staticInputBlocks.firstName.name, staticInputBlocks.firstName.settings);
const htmlSettings = Object.assign({}, html.metadata, html.settings);
htmlSettings.supports.multiple = false;
registerBlockType(html.name, htmlSettings);

const appElement = document.querySelector('#mailpoet_form_editor_v2');

if (appElement) {
  render(
    <App />,
    document.querySelector('#mailpoet_form_editor_v2')
  );
}
