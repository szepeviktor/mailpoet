<?php

namespace MailPoet\Test\Acceptance;

use Codeception\Scenario;
use MailPoet\Test\DataFactories\Settings;

class AddSendingKeyCest {
  public function addMailPoetSendingKey(\AcceptanceTester $i, Scenario $scenario) {
    $i->wantTo('Add a MailPoet sending key');

    $mailPoetSendingKey = getenv('WP_TEST_MAILER_MAILPOET_API');
    if (!$mailPoetSendingKey) {
      $scenario->skip("Skipping, 'WP_TEST_MAILER_MAILPOET_API' not set.");
    }

    $keyActivationTab = '[data-automation-id="activation_settings_tab"]';
    $i->login();
    $i->amOnMailPoetPage('Settings');
    $i->click($keyActivationTab);
    $i->fillField(['name' => 'premium[premium_key]'], $mailPoetSendingKey);
    $i->click('Verify');

    // validate key, activate MSS, install & activate Premium plugin
    $i->waitForText('Your key is valid');
    $i->waitForText('MailPoet Sending Service is active');
    $i->waitForText('MailPoet Premium plugin is being installed');
    $i->waitForText('downloading MailPoet Premium…');
    $i->waitForText('activating MailPoet Premium…');
    $i->waitForText('MailPoet Premium is active!');

    // check the state after reload
    $i->reloadPage();
    $i->waitForText('Your key is valid');
    $i->waitForText('MailPoet Sending Service is active');
    $i->waitForText('MailPoet Premium is active');

    // change MSS key state to pending approval, test modal for authorized FROM address
    $settings = new Settings();
    $settings->withMssKeyPendingApproval();
    $i->reloadPage();
    $i->waitForText('Sending all of your emails has been paused because your email address wp@example.com hasn’t been authorized yet.');

    $i->click('Verify');
    $i->waitForText('It’s time to set your default FROM address!');
    $i->waitForText('Set one of your authorized email addresses as the default FROM email for your MailPoet emails.');

    $i->fillField(['id' => 'mailpoet_set_from_address_modal_address'], 'invalid@email.com');
    $i->click('Save', '#set-from-address-modal');
    $i->waitForText('Can’t use this email yet! Please authorize it first.');

    $i->fillField(['id' => 'mailpoet_set_from_address_modal_address'], 'staff@mailpoet.com');
    $i->click('Save', '#set-from-address-modal');
    $i->waitForText('Excellent. Your authorized email was saved. You can change it in the Basics tab of the MailPoet settings.');
    $i->dontSee('Sending all of your emails has been paused because your email address %s hasn’t been authorized yet.');

    // try invalid key
    $i->fillField(['name' => 'premium[premium_key]'], 'invalid-key');
    $i->click('Verify');
    $i->waitForText('Your key is not valid for the MailPoet Sending Service');
    $i->waitForText('Your key is not valid for MailPoet Premium');
  }

  public function installAndActivatePremiumPlugin(\AcceptanceTester $i, Scenario $scenario) {
    $i->wantTo('Install and activate Premium plugin');

    $mailPoetSendingKey = getenv('WP_TEST_MAILER_MAILPOET_API');
    if (!$mailPoetSendingKey) {
      $scenario->skip("Skipping, 'WP_TEST_MAILER_MAILPOET_API' not set.");
    }

    $settings = new Settings();
    $settings->withSendingMethodMailPoet();
    $settings->withValidPremiumKey($mailPoetSendingKey);

    $keyActivationTab = '[data-automation-id="activation_settings_tab"]';
    $i->login();
    $i->amOnMailPoetPage('Settings');
    $i->click($keyActivationTab);

    // Premium plugin not installed
    $i->waitForText('Your key is valid');
    $i->waitForText('MailPoet Sending Service is active');
    $i->waitForText('MailPoet Premium is not installed. Install MailPoet Premium plugin');

    // install Premium plugin
    $i->click('Install MailPoet Premium plugin');
    $i->waitForText('downloading MailPoet Premium…');
    $i->waitForText('activating MailPoet Premium…');
    $i->waitForText('MailPoet Premium is active!');

    // deactivate Premium plugin
    $i->cli(['plugin', 'deactivate', 'mailpoet-premium']);
    $i->reloadPage();
    $i->waitForText('Your key is valid');
    $i->waitForText('MailPoet Sending Service is active');
    $i->waitForText('MailPoet Premium is not active. Activate MailPoet Premium plugin');

    // activate Premium plugin
    $i->click('Activate MailPoet Premium plugin');
    $i->waitForText('activating MailPoet Premium…');
    $i->waitForText('MailPoet Premium is active!');
    $i->dontSee('downloading MailPoet Premium…');
  }

  public function activateMss(\AcceptanceTester $i, Scenario $scenario) {
    $i->wantTo('Activate MSS');

    $mailPoetSendingKey = getenv('WP_TEST_MAILER_MAILPOET_API');
    if (!$mailPoetSendingKey) {
      $scenario->skip("Skipping, 'WP_TEST_MAILER_MAILPOET_API' not set.");
    }

    $settings = new Settings();
    $settings->withValidMssKey($mailPoetSendingKey);

    $keyActivationTab = '[data-automation-id="activation_settings_tab"]';
    $i->login();
    $i->amOnMailPoetPage('Settings');
    $i->click($keyActivationTab);

    // MSS not activated
    $i->waitForText('Your key is valid');
    $i->waitForText('MailPoet Sending Service is not active. Activate MailPoet Sending Service');

    // activate MSS
    $i->click('Activate MailPoet Sending Service');
    $i->waitForText('MailPoet Sending Service is active');
  }
}
