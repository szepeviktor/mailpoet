<?php

namespace MailPoet\Test\Acceptance;

use Codeception\Util\Locator;
use MailPoet\Test\DataFactories\Settings;

class CreateNewWordPressUserCest {

  /** @var Settings */
  private $settings;

  protected function _inject(Settings $settings) {
    $this->settings = $settings;
  }

  public function sendConfirmationEmail(\AcceptanceTester $i) {
    $i->wantTo('Create a new wordpress user and check if the confirmation email is sent');
    $this->settings->withConfirmationEmailEnabled();
    $this->settings->withSubscribeOnRegisterEnabled();

    //create a wp user with wp role subscriber
    $i->cli(['user', 'create', 'narwhal', 'standardtest@example.com', '--role=subscriber']);
    $i->amOnMailboxAppPage();
    $i->waitForElement(Locator::contains('span.subject', 'Confirm your subscription'));
    $i->click(Locator::contains('span.subject', 'Confirm your subscription'));
    $i->switchToIframe('preview-html');
    $i->click('I confirm my subscription!');
    $i->switchToNextTab();
    $i->see('You have subscribed');
    $i->seeNoJSErrors();
  }
}
