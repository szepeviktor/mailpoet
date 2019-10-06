import React from 'react';

const blockStyle = {
  padding: '10px',
  background: '#ddd',
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
const InputEdit = ({ attributes, setAttributes }) => {
  if (!attributes.id) {
    setAttributes({ id: 'mp-custom-add-input' });
  }
  return (
    <div style={blockStyle}>
      <h5>Add New Custom Field</h5>
      <label className="mailpoet_text_label" htmlFor={attributes.id} style={labelStyle}>
        Label
        <br />
        <input
          id={attributes.id}
          style={inputStyle}
          type={attributes.label}
          onChange={(event) => (setAttributes({ label: event.target.value }))}
          name="label"
          placeholder="Label"
        />
      </label>
      <button type="submit" onClick={() => setAttributes({ updated: true })}>Save</button>
    </div>
  );
};
export default InputEdit;
