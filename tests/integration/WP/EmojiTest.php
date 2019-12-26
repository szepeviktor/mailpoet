<?php

namespace MailPoet\Test\WP;

use Codeception\Stub\Expected;
use MailPoet\Config\Env;
use MailPoet\WP\Emoji;
use MailPoetVendor\Idiorm\ORM;

class EmojiTest extends \MailPoetTest {
  public function _before() {
    parent::_before();
    $this->data_encoded = "Emojis: &#x1f603;&#x1f635;&#x1f4aa;, not emojis: &#046;&#0142;";
    $this->data_decoded = "Emojis: 😃😵💪, not emojis: &#046;&#0142;";

    $this->column = 'dummycol';
    $this->emoji = new Emoji();
  }

  public function testItCanEncodeNewsletterRenderedBody() {
    $emoji = $this->make(
      Emoji::class,
      ['encodeForUTF8Column' => Expected::exactly(3, function ($params) {
        return $params;
      })],
      $this
    );
    $emoji->encodeEmojisInBody(['text' => 'call 1', 'html' => 'call 2']);
    $emoji->encodeEmojisInBody('string, call 3');
  }

  public function testItCanDecodeNewsletterBody() {
    $emoji = $this->make(
      Emoji::class,
      ['decodeEntities' => Expected::exactly(3, function ($params) {
        return $params;
      })],
      $this
    );
    $emoji->decodeEmojisInBody(['text' => 'call 1', 'html' => 'call 2']);
    $emoji->decodeEmojisInBody('string, call 3');
  }

  public function testItCanEncodeForUTF8Column() {
    $table = Env::$db_prefix . 'dummytable_utf8';
    $this->createTable($table, 'utf8');

    $result = $this->emoji->encodeForUTF8Column($table, $this->column, $this->data_decoded);
    expect($result)->equals($this->data_encoded);

    $this->dropTable($table);
  }

  public function testItDoesNotEncodeForUTF8MB4Column() {
    $table = Env::$db_prefix . 'dummytable_utf8mb4';
    $this->createTable($table, 'utf8mb4');

    $result = $this->emoji->encodeForUTF8Column($table, $this->column, $this->data_decoded);
    expect($result)->equals($this->data_decoded);

    $this->dropTable($table);
  }

  public function testItCanDecodeEntities() {
    $result = $this->emoji->decodeEntities($this->data_encoded);
    expect($result)->equals($this->data_decoded);
  }

  private function createTable($table, $charset) {
    ORM::raw_execute(
      'CREATE TABLE IF NOT EXISTS ' . $table
      . ' (' . $this->column . ' TEXT) '
      . 'DEFAULT CHARSET=' . $charset . ';'
    );
  }

  private function dropTable($table) {
    ORM::raw_execute('DROP TABLE IF EXISTS ' . $table);
  }
}
