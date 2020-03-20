import { select } from '@wordpress/data';
import MailPoet from 'mailpoet';
import { STORE_NAME } from '.';
import { Action } from './types';

export function setSetting(path: string[], value: any): Action {
  return { type: 'SET_SETTING', path, value };
}

export function setErrorFlag(value: boolean): Action {
  return { type: 'SET_ERROR_FLAG', value };
}

export function* openWoocommerceCustomizer(newsletterId?: string) {
  let id = newsletterId;
  if (!id) {
    const { res, success, error } = yield {
      type: 'CALL_API',
      endpoint: 'settings',
      action: 'set',
      data: { 'woocommerce.use_mailpoet_editor': 1 },
    };
    if (!success) {
      return { type: 'SAVE_FAILED', error };
    }
    id = res.data.woocommerce.transactional_email_id;
  }
  window.location.href = `?page=mailpoet-newsletter-editor&id=${id}`;
  return null;
}

export function* saveSettings() {
  yield { type: 'SAVE_STARTED' };
  const data = select(STORE_NAME).getSettings();
  const { success, error } = yield {
    type: 'CALL_API',
    endpoint: 'settings',
    action: 'set',
    data,
  };
  if (!success) {
    return { type: 'SAVE_FAILED', error };
  }
  yield { type: 'TRACK_SETTINGS_SAVED' };
  return { type: 'SAVE_DONE' };
}

export function* reinstall() {
  MailPoet.Modal.loading(true);
  const { success, error } = yield {
    type: 'CALL_API',
    endpoint: 'setup',
    action: 'reset',
  };
  MailPoet.Modal.loading(false);
  if (!success) {
    return { type: 'SAVE_FAILED', error };
  }
  yield { type: 'TRACK_REINSTALLED' };
  return { type: 'SAVE_DONE' };
}
