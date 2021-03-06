<?php

namespace MailPoet\Test\Form\Block;

use MailPoet\Form\Block\Heading;

class HeadingTest extends \MailPoetUnitTest {
  /** @var Heading */
  private $heading;

  public function _before() {
    parent::_before();
    $this->heading = new Heading();
  }

  public function testItShouldRenderHeading() {
    $html = $this->heading->render([]);
    expect($html)->startsWith('<h2');
  }

  public function testItShouldRenderContent() {
    $html = $this->heading->render([
      'params' => [
        'content' => 'Header',
      ],
    ]);
    expect($html)->equals('<h2>Header</h2>');
  }

  public function testItShouldRenderLevel() {
    $html = $this->heading->render([
      'params' => [
        'content' => 'Header',
        'level' => 1,
      ],
    ]);
    expect($html)->equals('<h1>Header</h1>');
  }

  public function testItShouldRenderClass() {
    $html = $this->heading->render([
      'params' => [
        'content' => 'Header',
        'level' => 1,
        'class_name' => 'class1 class2',
      ],
    ]);
    expect($html)->equals('<h1 class="class1 class2">Header</h1>');
  }

  public function testItShouldRenderAnchor() {
    $html = $this->heading->render([
      'params' => [
        'content' => 'Header',
        'level' => 1,
        'anchor' => 'anchor',
      ],
    ]);
    expect($html)->equals('<h1 id="anchor">Header</h1>');
  }

  public function testItShouldRenderAlign() {
    $html = $this->heading->render([
      'params' => [
        'content' => 'Header',
        'level' => 1,
        'align' => 'right',
      ],
    ]);
    expect($html)->equals('<h1 style="text-align: right">Header</h1>');
  }

  public function testItShouldRenderTextColour() {
    $html = $this->heading->render([
      'params' => [
        'content' => 'Header',
        'level' => 1,
        'text_color' => 'red',
      ],
    ]);
    expect($html)->equals('<h1 style="color: red">Header</h1>');
  }
}
