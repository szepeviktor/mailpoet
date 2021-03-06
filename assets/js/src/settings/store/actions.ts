import { select } from '@wordpress/data';
import MailPoet from 'mailpoet';
import { STORE_NAME } from '.';
import {
  Action, KeyActivationState, MssStatus, PremiumStatus, PremiumInstallationStatus,
} from './types';

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

export function updateKeyActivationState(fields: Partial<KeyActivationState>): Action {
  return { type: 'UPDATE_KEY_ACTIVATION_STATE', fields };
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

export function* verifyMssKey(key: string, activateMssIfKeyValid: boolean) {
  const { success, error, res } = yield {
    type: 'CALL_API',
    endpoint: 'services',
    action: 'checkMSSKey',
    data: { key },
  };
  if (!success) {
    yield updateKeyActivationState({
      mssStatus: MssStatus.INVALID,
      mssMessage: error.join(' ') || null,
    });
    return MssStatus.INVALID;
  }
  const fields: Partial<KeyActivationState> = {
    mssMessage: res.data.message || null,
  };
  if (activateMssIfKeyValid) {
    const call = yield {
      type: 'CALL_API',
      endpoint: 'settings',
      action: 'set',
      data: {
        mta_group: 'mailpoet',
        mta: { method: 'MailPoet', mailpoet_api_key: key },
        signup_confirmation: { enabled: '1' },
      },
    };
    if (!call.success) {
      fields.mssStatus = MssStatus.VALID_MSS_NOT_ACTIVE;
    } else {
      yield setSetting(['mta_group'], 'mailpoet');
      yield setSetting(['mta', 'method'], 'MailPoet');
      yield setSetting(['mta', 'mailpoet_api_key'], key);
      yield setSetting(['signup_confirmation', 'enabled'], '1');
      fields.mssStatus = MssStatus.VALID_MSS_ACTIVE;
    }
  } else {
    fields.mssStatus = MssStatus.VALID_MSS_NOT_ACTIVE;
  }
  yield updateKeyActivationState(fields);
  return fields.mssStatus;
}

export function* verifyPremiumKey(key: string) {
  const { res, success, error } = yield {
    type: 'CALL_API',
    endpoint: 'services',
    action: 'checkPremiumKey',
    data: { key },
  };
  if (!success) {
    MailPoet.trackEvent(
      'User has failed to validate a Premium key',
      {
        'MailPoet Free version': MailPoet.version,
        'Premium plugin is active': !!MailPoet.premiumVersion,
      }
    );
    return updateKeyActivationState({
      premiumStatus: PremiumStatus.INVALID,
      premiumMessage: error.join(' ') || null,
    });
  }

  yield updateKeyActivationState({ premiumMessage: null });
  // install/activate Premium plugin
  let pluginInstalled = res.meta.premium_plugin_installed;
  let pluginActive = res.meta.premium_plugin_active;

  if (!pluginInstalled) {
    pluginInstalled = yield* installPremiumPlugin();
  }

  if (pluginInstalled && !pluginActive) {
    pluginActive = yield* activatePremiumPlugin(!res.meta.premium_plugin_installed);
  }

  if (pluginInstalled && pluginActive) {
    yield updateKeyActivationState({ premiumStatus: PremiumStatus.VALID_PREMIUM_PLUGIN_ACTIVE });
  }

  MailPoet.trackEvent(
    'User has validated a Premium key',
    {
      'MailPoet Free version': MailPoet.version,
      'Premium plugin is active': pluginActive,
    }
  );

  return null;
}

export function* activatePremiumPlugin(isAfterInstall) {
  const doneStatus = isAfterInstall
    ? PremiumInstallationStatus.INSTALL_DONE
    : PremiumInstallationStatus.ACTIVATE_DONE;
  const errorStatus = isAfterInstall
    ? PremiumInstallationStatus.INSTALL_ACTIVATING_ERROR
    : PremiumInstallationStatus.ACTIVATE_ERROR;
  yield updateKeyActivationState({
    premiumStatus: PremiumStatus.VALID_PREMIUM_PLUGIN_BEING_ACTIVATED,
    premiumInstallationStatus: isAfterInstall
      ? PremiumInstallationStatus.INSTALL_ACTIVATING
      : PremiumInstallationStatus.ACTIVATE_ACTIVATING,
  });
  const call = yield {
    type: 'CALL_API',
    endpoint: 'premium',
    action: 'activatePlugin',
  };
  if (call && !call.success) {
    yield updateKeyActivationState({ premiumInstallationStatus: errorStatus });
    return false;
  }
  yield updateKeyActivationState({ premiumInstallationStatus: doneStatus });
  return true;
}

export function* installPremiumPlugin() {
  yield updateKeyActivationState({
    premiumStatus: PremiumStatus.VALID_PREMIUM_PLUGIN_BEING_INSTALLED,
    premiumInstallationStatus: PremiumInstallationStatus.INSTALL_INSTALLING,
  });
  const call = yield {
    type: 'CALL_API',
    endpoint: 'premium',
    action: 'installPlugin',
  };
  if (call && !call.success) {
    yield updateKeyActivationState({
      premiumInstallationStatus: PremiumInstallationStatus.INSTALL_INSTALLING_ERROR,
    });
    return false;
  }
  return yield* activatePremiumPlugin(true);
}
