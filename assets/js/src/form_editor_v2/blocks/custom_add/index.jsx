/**
 * Internal dependencies
 */
import edit from './edit.jsx';

export const name = 'mailpoet-form/acc-custom-field';

export const settings = {
  title: 'New Custom Field',
  icon: 'plus',
  category: 'custom',
  attributes: {
    id: {
      type: 'string',
    },
    updated: {
      type: 'boolean',
      default: false,
    },
    label: {
      type: 'string',
      default: 'Label',
    },
    fieldType: {
      type: 'string',
      default: 'text',
    },
    fieldName: {
      type: 'string',
      default: 'label',
    },
    useLabels: {
      type: 'boolean',
      default: true,
    },
  },
  supports: {
    html: false,
    customClassName: false,
    multiple: false,
  },
  edit,
  save() {
    return null;
  },
};
