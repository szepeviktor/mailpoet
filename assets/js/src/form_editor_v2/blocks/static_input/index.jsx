/**
 * Internal dependencies
 */
import icon from './icon.jsx';
import edit from './edit.jsx';

export const email = {
  name: 'mailpoet-form/input-email',
  settings: {
    title: 'Input Email',
    icon,
    category: 'widgets',
    attributes: {
      id: {
        type: 'string',
        default: 'email',
      },
      label: {
        type: 'string',
        default: 'Email',
      },
      fieldType: {
        type: 'string',
        default: 'email',
      },
      fieldName: {
        type: 'string',
        default: 'email',
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
  },
};

export const firstName = {
  name: 'mailpoet-form/input-first-name',
  settings: {
    title: 'Input First Name',
    icon,
    category: 'widgets',
    attributes: {
      id: {
        type: 'string',
        default: 'first_name',
      },
      label: {
        type: 'string',
        default: 'First Name',
      },
      fieldType: {
        type: 'string',
        default: 'text',
      },
      fieldName: {
        type: 'string',
        default: 'first_name',
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
  },
};
