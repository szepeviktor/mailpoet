import React from 'react';
/**
 * WordPress dependencies
 */
import {
  compose,
  withInstanceId,
} from '@wordpress/compose';

const blockStyle = {
  padding: '0px',
};

const inputStyle = {
  borderColor: '#666',
  color: '#333',
  padding: '10px',
  fontSize: '16px',
};

const labelStyle = {
  color: '#333',
};

// eslint-disable-next-line react/prop-types
const InputEdit = ({ instanceId, attributes, setAttributes }) => {
  if (!attributes.id) {
    setAttributes({ id: `mp-input-id-${instanceId}` });
  }
  if (attributes.useLabels) {
    return (
      <div style={blockStyle}>
        <label className="mailpoet_text_label" htmlFor={attributes.id} style={labelStyle}>
          {attributes.label}
          <br />
          <input id={attributes.id} style={inputStyle} type={attributes.fieldType} name="name" placeholder="placeholder" />
        </label>
      </div>
    );
  }
  return (
    <div style={blockStyle}>
      <input id={attributes.id} style={inputStyle} type={attributes.fieldType} name="name" placeholder={attributes.label} />
    </div>
  );
};
export default compose([
  withInstanceId,
])(InputEdit);
