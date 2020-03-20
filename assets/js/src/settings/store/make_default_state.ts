import { State } from './types';
import normalizeSettings from './normalize_settings';

export default function makeDefaultState(window: any): State {
  return {
    save: {
      inProgress: false,
      error: null,
    },
    flags: {
      error: false,
      woocommerce: !!window.mailpoet_woocommerce_active,
      membersPlugin: !!window.mailpoet_members_plugin_active,
      newUser: !!window.mailpoet_is_new_user,
      builtInCaptcha: window.mailpoet_built_in_captcha_supported,
    },
    data: normalizeSettings(window.mailpoet_settings),
    segments: window.mailpoet_segments,
    pages: window.mailpoet_pages,
    paths: window.mailpoet_paths,
  };
}
