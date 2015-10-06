<?php
namespace MailPoet\Config;

use MailPoet\Models;
use MailPoet\Router;

if(!defined('ABSPATH')) exit;

class Initializer {
  function __construct($params = array(
    'file'    => '',
    'version' => '1.0.0'
  )) {
    Env::init($params['file'], $params['version']);
  }

  function init() {
    $this->setupDB();
    $this->setupActivator();
    $this->setupRenderer();
    $this->setupLocalizer();
    $this->setupMenu();
    $this->setupRouter();
    $this->setupWidget();
  }

  function setupDB() {
    \ORM::configure(Env::$db_source_name);
    \ORM::configure('username', Env::$db_username);
    \ORM::configure('password', Env::$db_password);
    \ORM::configure('logging', WP_DEBUG);
    \ORM::configure('driver_options', array(
      \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    ));

    $subscribers = Env::$db_prefix . 'subscribers';
    $settings = Env::$db_prefix . 'settings';
    $newsletters = Env::$db_prefix . 'newsletters';
    $newsletter_templates = Env::$db_prefix . 'newsletter_templates';
    $segments = Env::$db_prefix . 'segments';
    $subscriber_segment = Env::$db_prefix . 'subscriber_segment';
    $newsletter_segment = Env::$db_prefix . 'newsletter_segment';

    define('MP_SUBSCRIBERS_TABLE', $subscribers);
    define('MP_SETTINGS_TABLE', $settings);
    define('MP_NEWSLETTERS_TABLE', $newsletters);
    define('MP_SEGMENTS_TABLE', $segments);
    define('MP_SUBSCRIBER_SEGMENT_TABLE', $subscriber_segment);
    define('MP_NEWSLETTER_TEMPLATES_TABLE', $newsletter_templates);
    define('MP_NEWSLETTER_SEGMENT_TABLE', $newsletter_segment);
  }

  function setupActivator() {
    $activator = new Activator();
    $activator->init();
  }

  function setupRenderer() {
    $renderer = new Renderer();
    $this->renderer = $renderer->init();
  }

  function setupLocalizer() {
    $localizer = new Localizer($this->renderer);
    $localizer->init();
  }

  function setupMenu() {
    $menu = new Menu(
      $this->renderer,
      Env::$assets_url
    );
    $menu->init();
  }

  function setupRouter() {
    $router = new Router\Router();
    $router->init();
  }

  function setupWidget() {
    $widget = new Widget();
    $widget->init();
  }
}
