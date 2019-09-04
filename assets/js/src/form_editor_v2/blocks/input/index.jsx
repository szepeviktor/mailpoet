/**
 * Internal dependencies
 */
import icon from './icon.jsx';
import edit from './edit.jsx';

export const name = 'mailpoet-form/input-field';

export const settings = {
  title: 'Input Field',
  icon,
  category: 'widgets',
  attributes: {
    id: {
      type: 'string',
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
  },
  edit,
  save() {
    return null;
  },
};
