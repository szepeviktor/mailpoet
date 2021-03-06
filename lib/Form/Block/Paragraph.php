<?php

namespace MailPoet\Form\Block;

class Paragraph {
  public function render(array $block): string {
    $content = ($block['params']['content'] ?? '');
    return $this->wrapContent($content, $block);
  }

  private function wrapContent(string $content, array $block): string {
    $attributes = $this->renderAttributes($block);
    $openTag = $this->getOpenTag($attributes);
    return $openTag
      . $content
      . "</p>";
  }

  private function getOpenTag(array $attributes): string {
    if (empty($attributes)) {
      return "<p>";
    }
    return "<p " . join(' ', $attributes) . ">";
  }

  private function renderAttributes(array $block): array {
    $result = [];
    $result[] = $this->renderClass($block);
    $result[] = $this->renderStyle($block);
    $result = array_filter($result, function ($attribute) {
      return $attribute !== null;
    });
    return $result;
  }

  private function renderClass(array $block) {
    $classes = [];
    if (isset($block['params']['class_name'])) {
      $classes[] = $block['params']['class_name'];
    }
    if (isset($block['params']['drop_cap']) && $block['params']['drop_cap'] === '1') {
      $classes[] = 'has-drop-cap';
    }
    if (empty($classes)) {
      return null;
    }
    return 'class="'
    . join(' ', $classes)
    . '"';
  }

  private function renderStyle(array $block) {
    $styles = [];
    if (isset($block['params']['background_color'])) {
      $styles[] = 'background-color: ' . $block['params']['background_color'];
    }
    if (isset($block['params']['align'])) {
      $styles[] = 'text-align: ' . $block['params']['align'];
    }
    if (isset($block['params']['text_color'])) {
      $styles[] = 'color: ' . $block['params']['text_color'];
    }
    if (isset($block['params']['font_size'])) {
      $styles[] = 'font-size: ' . $block['params']['font_size'] . 'px';
    }
    if (empty($styles)) {
      return null;
    }
    return 'style="'
      . join('; ', $styles)
      . '"';
  }
}
