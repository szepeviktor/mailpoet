<?php

namespace MailPoet\Test\Form;

use MailPoet\Form\BlockStylesRenderer;

require_once __DIR__ . '/HtmlParser.php';

class BlockStylesRendererTest extends \MailPoetUnitTest {
  /** @var BlockStylesRenderer */
  private $renderer;

  public function _before() {
    parent::_before();
    $this->renderer = new BlockStylesRenderer();
  }

  public function testItShouldReturnEmptyStringForNoStylesOrUnsupportedStyles() {
    expect($this->renderer->renderForTextInput([]))->equals('');
    expect($this->renderer->renderForTextInput(['nonsense' => '10px']))->equals('');
  }

  public function testItShouldRenderSingleTextInputStyles() {
    expect($this->renderer->renderForTextInput(['border_radius' => 10]))->equals('border-style:solid;border-radius:10px;');
    expect($this->renderer->renderForTextInput(['border_color' => '#fff']))->equals('border-style:solid;border-color:#fff;');
    expect($this->renderer->renderForTextInput(['border_size' => 10]))->equals('border-style:solid;border-width:10px;');
    expect($this->renderer->renderForTextInput(['background_color' => '#dddddd']))->equals('background-color:#dddddd;');
  }

  public function testItShouldCompleteTextInputStyles() {
    $styles = [
      'border_radius' => 10,
      'border_color' => '#fff',
      'border_size' => 10,
      'background_color' => '#dddddd',
      'bold' => '1',
    ];
    $result = $this->renderer->renderForTextInput($styles);
    expect($result)->contains('border-radius:10px;');
    expect($result)->contains('border-color:#fff;');
    expect($result)->contains('border-width:10px;');
    expect($result)->contains('background-color:#dddddd;');
    expect($result)->notContains('font-weight:bold;');
  }

  public function testItShouldRenderSingleButtonStyles() {
    expect($this->renderer->renderForButton(['border_radius' => 10]))->equals('border-style:solid;border-radius:10px;');
    expect($this->renderer->renderForButton(['border_color' => '#fff']))->equals('border-style:solid;border-color:#fff;');
    expect($this->renderer->renderForButton(['border_size' => 10]))->equals('border-style:solid;border-width:10px;');
    expect($this->renderer->renderForButton(['background_color' => '#dddddd']))->equals('background-color:#dddddd;');
    expect($this->renderer->renderForButton(['font_color' => '#aaa']))->equals('color:#aaa;');
    expect($this->renderer->renderForButton(['font_size' => 10]))->equals('font-size:10px;');
  }

  public function testItShouldCompleteButtonStyles() {
    $styles = [
      'border_radius' => 10,
      'border_color' => '#fff',
      'border_size' => 10,
      'background_color' => '#dddddd',
      'font_color' => '#eeeeee',
      'font_size' => 8,
      'bold' => '1',
    ];
    $result = $this->renderer->renderForButton($styles);
    expect($result)->contains('border-radius:10px;');
    expect($result)->contains('border-color:#fff;');
    expect($result)->contains('border-width:10px;');
    expect($result)->contains('background-color:#dddddd;');
    expect($result)->contains('color:#eeeeee;');
    expect($result)->contains('font-size:8px;');
    expect($result)->contains('font-weight:bold;');
  }
}
