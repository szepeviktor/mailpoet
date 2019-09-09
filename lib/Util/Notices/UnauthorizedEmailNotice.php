<?php

namespace MailPoet\Util\Notices;

use MailPoet\Services\AuthorizedEmailsController;
use MailPoet\Settings\SettingsController;
use MailPoet\Util\Helpers;
use MailPoet\WP\Functions as WPFunctions;
use MailPoet\WP\Notice;
use MailPoet\Newsletter\Renderer\EscapeHelper;

class UnauthorizedEmailNotice {

  const OPTION_NAME = 'unauthorized-email-addresses-notice';

  /** @var SettingsController */
  private $settings;

  /** @var WPFunctions */
  private $wp;

  function __construct(SettingsController $settings, WPFunctions $wp) {
    $this->settings = $settings;
    $this->wp = $wp;
  }

  function init($should_display) {
    $validation_error = $this->settings->get(AuthorizedEmailsController::AUTHORIZED_EMAIL_ADDRESSES_ERROR_SETTING);
    if ($should_display && isset($validation_error['invalid_sender_address'])) {
      return $this->display($validation_error);
    }
  }

  function display($validation_error) {
    $message = $this->getMessageText($validation_error);
    $message .= $this->getSettingsButtons($validation_error);
    $message .= $this->getAuthorizationLink($validation_error);
    $message .= $this->getResumeSendingButton();
    $extra_classes = 'mailpoet-js-error-unauthorized-emails-notice';
    Notice::displayError($message, $extra_classes, self::OPTION_NAME, false, false);
  }

  private function getMessageText($validation_error) {
    $text = $this->wp->_x('<b>Sending all of your emails has been paused</b> because your email address %email-address hasn’t been authorized yet.</b>',
      'Email addresses have to be authorized to be used to send emails. %email-address will be replaced by an email address.'
    );
    $message = str_replace('%email-address', EscapeHelper::escapeHtmlText($validation_error['invalid_sender_address']), $text);
    return "<p>$message</p>";
  }

  private function getSettingsButtons($validation_error) {
    $buttons = '';
    if (!empty($validation_error['invalid_sender_address'])) {
      $button = $this->wp->_x('Update my Default sender email address', 'Please reuse the current translation of “Default sender”');
      $button = Helpers::replaceLinkTags("[link]{$button}[/link]", 'admin.php?page=mailpoet-settings', ['class' => 'button button-secondary']);
      $buttons .= "<p>$button</p>";
    }
    return $buttons;
  }

  private function getAuthorizationLink($validation_error) {
    $email = $validation_error['invalid_sender_address'];
    $authorize_link = $this->wp->_x('Authorize %email', 'Link for user to authorize their email address');
    $authorize_link = str_replace('%email', EscapeHelper::escapeHtmlText($email), $authorize_link);
    $authorize_link = Helpers::replaceLinkTags("[link]{$authorize_link}[/link]", 'https://account.mailpoet.com/authorization', ['target' => '_blank']);
    $html = '<p><b>' . $this->wp->_x('OR', 'User has to choose between two options') . '</b></p>';
    $html .= "<p>$authorize_link</p>";
    return $html;
  }

  private function getResumeSendingButton() {
    $button = '<button class="button button-primary mailpoet-js-button-resume-sending">' . $this->wp->__('Resume sending', 'mailpoet') . '</button>';
    return "<p>$button</p>";
  }
}
