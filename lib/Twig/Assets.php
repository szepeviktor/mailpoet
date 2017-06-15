<?php
namespace MailPoet\Twig;

if(!defined('ABSPATH')) exit;

class Assets extends \Twig_Extension implements \Twig_Extension_GlobalsInterface {
  private $_globals;

  public function __construct($globals) {
    $this->_globals = $globals;
  }

  public function getName() {
    return 'assets';
  }

  public function getGlobals() {
    return $this->_globals;
  }

  public function getFunctions() {
    return array(
      new \Twig_SimpleFunction(
        'stylesheet',
        array($this, 'generateStylesheet'),
        array('is_safe' => array('all'))
      ),
      new \Twig_SimpleFunction(
        'javascript',
        array($this, 'generateJavascript'),
        array('is_safe' => array('all'))
      ),
      new \Twig_SimpleFunction(
        'image_url',
        array($this, 'generateImageUrl'),
        array('is_safe' => array('all'))
      )
    );
  }

  public function generateStylesheet() {
    $stylesheets = func_get_args();
    $output = array();

    foreach($stylesheets as $stylesheet) {
      $output[] = sprintf(
        '<link rel="stylesheet" type="text/css" href="%s/css/%s" />',
        $this->_globals['assets_url'],
        $this->getAssetFilename('css', $stylesheet)
      );
    }

    return join("\n", $output);
  }

  public function generateJavascript() {
    $scripts = func_get_args();
    $output = array();

    foreach($scripts as $script) {
      $output[] = sprintf(
        '<script type="text/javascript" src="%s/js/%s"></script>',
        $this->_globals['assets_url'],
        $this->getAssetFilename('js', $script)
      );
    }

    return join("\n", $output);
  }

  public function generateImageUrl($path) {
    return $this->appendVersionToUrl(
      $this->_globals['assets_url'] . '/img/' . $path
    );
  }

  public function appendVersionToUrl($url) {
    return add_query_arg('mailpoet_version', $this->_globals['version'], $url);
  }

  public function getAssetFileName($asset_type, $asset) {
    $manifest = sprintf(
      '%s/%s/manifest.json',
      $this->_globals['assets_path'],
      $asset_type,
      $asset
    );
    if(!is_file($manifest)) return $asset;
    $manifest = json_decode(file_get_contents($manifest), true);
    return (!empty($manifest[$asset])) ? $manifest[$asset] : $asset;
  }
}