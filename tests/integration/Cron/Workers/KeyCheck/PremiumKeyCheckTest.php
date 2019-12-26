<?php

namespace MailPoet\Test\Cron\Workers\KeyCheck;

use Codeception\Util\Stub;
use MailPoet\Cron\Workers\KeyCheck\PremiumKeyCheck;
use MailPoet\Services\Bridge;
use MailPoet\Settings\SettingsController;
use MailPoet\Settings\SettingsRepository;

class PremiumKeyCheckTest extends \MailPoetTest {

  /** @var SettingsController */
  private $settings;

  public function _before() {
    parent::_before();
    $this->settings = SettingsController::getInstance();
    $this->premium_key = '123457890abcdef';
    $this->worker = new PremiumKeyCheck($this->settings, microtime(true));
  }

  public function testItRequiresPremiumKeyToBeSpecified() {
    expect($this->worker->checkProcessingRequirements())->false();
    $this->fillPremiumKey();
    expect($this->worker->checkProcessingRequirements())->true();
  }

  public function testItChecksPremiumKey() {
    $response = ['code' => Bridge::KEY_VALID];
    $this->worker->bridge = Stub::make(
      new Bridge,
      [
        'checkPremiumKey' => $response,
        'storePremiumKeyAndState' => null,
      ],
      $this
    );
    $this->worker->bridge->expects($this->once())
      ->method('checkPremiumKey')
      ->with($this->equalTo($this->premium_key));
    $this->worker->bridge->expects($this->once())
      ->method('storePremiumKeyAndState')
      ->with(
        $this->equalTo($this->premium_key),
        $this->equalTo($response)
      );
    $this->fillPremiumKey();
    expect($this->worker->checkKey())->equals($response);
  }

  private function fillPremiumKey() {
    $this->settings->set(
      Bridge::PREMIUM_KEY_SETTING_NAME,
      $this->premium_key
    );
  }

  public function _after() {
    $this->di_container->get(SettingsRepository::class)->truncate();
  }
}
