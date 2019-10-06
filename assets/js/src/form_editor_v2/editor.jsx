/**
 * WordPress dependencies
 */
import '@wordpress/editor'; // This shouldn't be necessary
import React from 'react';

import {
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
  transformStyles,
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
import { registerBlockType, setCategories } from '@wordpress/blocks';
import * as html from '@wordpress/block-library/build-module/html';
import * as columns from '@wordpress/block-library/build-module/columns';
import * as column from '@wordpress/block-library/build-module/column';

import '@wordpress/format-library';
/**
 * Internal dependencies
 */
import MailPoet from '../mailpoet';
import * as BCMapper from './bc-mapper.jsx';
import * as submitBlock from './blocks/submit/index.jsx';
import * as inputBlock from './blocks/input/index.jsx';
import * as customAdd from './blocks/custom_add/index.jsx';
import * as staticInputBlocks from './blocks/static_input/index.jsx';
import SidePanel from './components/panel.jsx';

// eslint-disable-next-line react/prop-types
export const Editor = ({ themeStyles }) => {
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

  const [blocks, updateBlocks] = useState(BCMapper.getBlocks(BCMapper.formData));
  const [formName, updateFormName] = useState(BCMapper.formData.name);
  const [formStyles, updateFormStyles] = useState(BCMapper.formData.styles || '');
  const [useLabels, updateUseLabels] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [formLists, updateFormLists] = useState([]);

  const blocksRef = useRef();

  useEffect(() => {
    const updatedStyles = transformStyles(themeStyles, '.editor-styles-wrapper');

    updatedStyles.forEach((updatedCSS) => {
      if (updatedCSS) {
        const node = document.createElement('style');
        node.innerHTML = updatedCSS;
        document.body.appendChild(node);
      }
    });
  }, [themeStyles]);

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('Current blocks');
    console.log(blocks);
    const emails = blocks.filter((block) => (block.clientId === 'email'));
    if (!emails.length) {
      MailPoet.Notice.warning('Can‘t delete email');
      updateBlocks(blocksRef.current);
      return;
    }
    const submits = blocks.filter((block) => (block.clientId === 'submit'));
    if (!submits.length) {
      MailPoet.Notice.warning('Can‘t delete submit button');
      updateBlocks(blocksRef.current);
      return;
    }
    blocksRef.current = blocks;

    const addCustom = blocks.find((block) => (block.name === 'mailpoet-form/acc-custom-field'));
    if (addCustom && addCustom.attributes.updated) {
      const attributes = Object.assign({}, inputBlock.settings.attributes);
      attributes.label.default = addCustom.attributes.label;
      const settings = Object.assign(
        {}, inputBlock.settings, {
          title: addCustom.attributes.label,
          attributes,
        }
      );
      const blockName = `mailpoet-form/custom-${addCustom.attributes.label.toLowerCase()}`.split(' ').join('-');
      const blockId = `mailpoet-custom-${addCustom.attributes.label.toLowerCase()}`.split(' ').join('-');
      registerBlockType(blockName, settings);
      const newBlock = {
        clientId: blockId,
        isValid: true,
        name: blockName,
        innerBlocks: [],
        attributes: {
          id: blockId,
          label: addCustom.attributes.label,
          fieldType: 'text',
          fieldName: addCustom.attributes.label.toLowerCase(),
          useLabels: true,
        },
      };
      const newBlocks = blocks.slice(0).filter((item) => (item.name !== 'mailpoet-form/acc-custom-field'));
      newBlocks.push(newBlock);
      updateBlocks(newBlocks);
    }
  }, [blocks]);

  const onUseLabelsChange = (value) => {
    const newBlocks = blocks.map((block) => {
      if (block.attributes.useLabels === undefined) {
        return block;
      }
      const updatedBlock = Object.assign({}, block);
      updatedBlock.attributes.useLabels = value;
      return updatedBlock;
    });
    updateBlocks(newBlocks);
    updateUseLabels(value);
  };

  // Editor settings see @wordpress/block-editor/src/store/defaults.js
  const editorSettings = {
    showInserterHelpPanel: false,
  };

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
  return (
    <Fragment>
      <div className="playground__body">
        <SlotFillProvider>
          <DropZoneProvider>
            <BlockEditorProvider
              value={blocks}
              onInput={updateBlocks}
              onChange={updateBlocks}
              settings={editorSettings}
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
                    <ToggleControl label="Use labels" checked={useLabels} onChange={onUseLabelsChange} />
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
                <SidePanel />
              </div>
            </BlockEditorProvider>
          </DropZoneProvider>
        </SlotFillProvider>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: formStyles }} />
    </Fragment>
  );
};

export const initBlocks = () => {
  // Set custom categories
  setCategories([
    { slug: 'static', title: 'Static Inputs' },
    { slug: 'custom', title: 'Custom fields' },
    { slug: 'layout', title: 'Layout components' },
  ]);

  registerBlockType(submitBlock.name, submitBlock.settings);
  registerBlockType(staticInputBlocks.email.name, staticInputBlocks.email.settings);
  registerBlockType(staticInputBlocks.firstName.name, staticInputBlocks.firstName.settings);
  registerBlockType(customAdd.name, customAdd.settings);
  registerBlockType(inputBlock.name, inputBlock.settings);
  // Core blocks
  const htmlSettings = Object.assign({}, html.metadata, html.settings, { category: 'layout' });
  htmlSettings.supports.multiple = false;
  registerBlockType(html.name, htmlSettings);
  registerBlockType(columns.name, Object.assign({}, columns.metadata, columns.settings, { category: 'layout' }));
  registerBlockType(column.name, Object.assign({}, column.metadata, column.settings, { category: 'layout' }));
};
