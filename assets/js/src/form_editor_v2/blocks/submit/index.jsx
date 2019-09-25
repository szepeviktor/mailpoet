/**
 * Internal dependencies
 */
import icon from './icon.jsx';
import edit from './edit.jsx';

export const name = 'mailpoet-form/submit-button';

export const settings = {
  title: 'Submit Button',
  icon,
  attributes: {
    id: {
      type: 'string',
      string: 'submit',
    },
    label: {
      type: 'string',
      default: 'Submit',
    },
    borderRadius: {
      type: 'integer',
      default: 0,
    },
  },
  category: 'static',
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
