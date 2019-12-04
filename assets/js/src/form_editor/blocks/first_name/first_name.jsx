import MailPoet from 'mailpoet';
import icon from './icon.jsx';
import edit from './edit.jsx';

export const name = 'mailpoet-form/first-name-input';

export const settings = {
  title: MailPoet.I18n.t('blockFirstName'),
  description: MailPoet.I18n.t('blockFirstNameDescription'),
  icon,
  category: 'fields',
  attributes: {
    label: {
      type: 'string',
      default: MailPoet.I18n.t('blockFirstName'),
    },
    labelWithinInput: {
      type: 'boolean',
      default: true,
    },
    mandatory: {
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
