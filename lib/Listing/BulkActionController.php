<?php

namespace MailPoet\Listing;

class BulkActionController {
  /** @var BulkActionFactory */
  private $factory;

  /** @var Handler */
  private $handler;

  public function __construct(BulkActionFactory $factory, Handler $handler) {
    $this->factory = $factory;
    $this->handler = $handler;
  }

  public function apply($model_class, array $data) {
    $bulk_action_method = 'bulk' . ucfirst($data['action']);
    unset($data['action']);

    $action_class = $this->factory->getActionClass($model_class, $bulk_action_method);
    $callback = [$action_class, $bulk_action_method];

    if (is_callable($callback)) {
      return call_user_func_array(
        $callback,
        [$this->handler->getSelection($model_class, $data['listing']), $data]
      );
    }
  }
}
