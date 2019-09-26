<?php

namespace MailPoet\AdminPages\Pages;

use MailPoet\AdminPages\PageRenderer;
use MailPoet\Form\Renderer as FormRenderer;
use MailPoet\Form\Block;
use MailPoet\Models\Form;
use MailPoet\Models\Segment;
use MailPoet\Settings\Pages;

if (!defined('ABSPATH')) exit;

class FormEditorV2 {
  /** @var PageRenderer */
  private $page_renderer;

  function __construct(PageRenderer $page_renderer) {
    $this->page_renderer = $page_renderer;
  }

  function render() {
    $id = (isset($_GET['id']) ? (int)$_GET['id'] : 0);
    $form = Form::findOne($id);
    if ($form instanceof Form) {
      $form = $form->asArray();
    }

    $data = [
      'form' => $form,
      'pages' => Pages::getAll(),
      'segments' => Segment::getSegmentsWithSubscriberCount(),
      'styles' => FormRenderer::getStyles($form),
      'date_types' => Block\Date::getDateTypes(),
      'date_formats' => Block\Date::getDateFormats(),
      'month_names' => Block\Date::getMonthNames(),
      'sub_menu' => 'mailpoet-forms',
      'editor_styles' => $this->getEditorStyles(),
    ];

    $this->page_renderer->displayPage('form/editor_v2.html', $data);
  }

  private function getEditorStyles() {
    $styles = [];
    global $editor_styles;
    if ($editor_styles && current_theme_supports('editor-styles')) {
      foreach ($editor_styles as $style) {
        if (preg_match('~^(https?:)?//~', $style)) {
          $response = wp_remote_get($style);
          if (!is_wp_error($response)) {
            $styles[] = ['css' => wp_remote_retrieve_body($response)];
          }
        } else {
          $file = get_theme_file_path($style);
          if (is_file($file)) {
            $styles[] = [
              'css' => file_get_contents( $file ),
              'baseURL' => get_theme_file_uri( $style ),
            ];
          }
        }
      }
    }
    return $styles;
  }
}
