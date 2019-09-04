import React from 'react';
/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { TextControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

const blockStyle = {
  padding: '0px',
};

// eslint-disable-next-line react/prop-types
const SubmitEdit = ({ attributes, setAttributes }) => {
  const changeLabel = (value) => {
    setAttributes({ label: value });
  };

  const changeBorderRadius = (value) => {
    setAttributes({ borderRadius: value });
  };

  const buttonStyle = {
    borderColor: '#aaa',
    backgroundColor: '#ddd',
    color: '#333',
    padding: '10px 15px',
    fontSize: '20px',
    borderRadius: `${attributes.borderRadius}px`,
  };

  const inspectorControls = (
    <InspectorControls>
      <TextControl
        label={__('Button label', 'mailpoet')}
        value={attributes.label}
        onChange={changeLabel}
      />
      <RangeControl
        value={attributes.borderRadius || 0}
        min={0}
        max={50}
        label={__('Border radius', 'mailpoet')}
        onChange={changeBorderRadius}
      />
    </InspectorControls>
  );

  return (
    <Fragment>
      { inspectorControls }
      <div style={blockStyle}>
        <button type="submit" className="mailpoet_submit" style={buttonStyle}>{ attributes.label }</button>
      </div>
    </Fragment>
  );
};
export default SubmitEdit;
