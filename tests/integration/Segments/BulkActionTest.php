<?php

namespace MailPoet\Segments;

use Codeception\Util\Stub;
use MailPoet\Models\Segment;
use MailPoet\Models\Subscriber;
use MailPoet\Models\SubscriberSegment;
use MailPoet\WP\Functions as WPFunctions;
use MailPoetVendor\Idiorm\ORM;
use PHPUnit\Framework\MockObject\MockObject;

require_once('SubscribersBulkActionHandlerMock.php');

class BulkActionTest extends \MailPoetTest {
  public $subscriber2;
  public $subscriber1;
  public $segment2;
  public $segment1;

  public function _before() {
    parent::_before();
    $this->cleanData();
    $this->segment1 = Segment::createOrUpdate(['name' => 'Segment 1', 'type' => 'default']);
    $this->segment2 = Segment::createOrUpdate(['name' => 'Segment 3', 'type' => 'not default']);
    $this->subscriber1 = Subscriber::createOrUpdate([
      'email' => 'john@mailpoet.com',
      'first_name' => 'John',
      'last_name' => 'Doe',
      'status' => Subscriber::STATUS_SUBSCRIBED,
      'segments' => [
        $this->segment1->id,
      ],
    ]);
    $this->subscriber2 = Subscriber::createOrUpdate([
      'email' => 'jake@mailpoet.com',
      'first_name' => 'Jake',
      'last_name' => 'Doe',
      'status' => Subscriber::STATUS_SUBSCRIBED,
      'segments' => [
        $this->segment2->id,
      ],
    ]);
    SubscriberSegment::resubscribeToAllSegments($this->subscriber1);
    SubscriberSegment::resubscribeToAllSegments($this->subscriber2);
  }

  public function _after() {
    $this->cleanData();
  }

  private function cleanData() {
    ORM::raw_execute('TRUNCATE ' . Segment::$_table);
    ORM::raw_execute('TRUNCATE ' . SubscriberSegment::$_table);
    ORM::raw_execute('TRUNCATE ' . Subscriber::$_table);
  }

  public function testBulkActionWithoutSegment() {
    $handler = new BulkAction([]);
    $this->expectException('InvalidArgumentException');
    $handler->apply();
  }

  public function testBulkActionForDefaultSegment() {
    $handler = new BulkAction([
      'listing' => ['filter' => ['segment' => $this->segment1->id]],
      'action' => 'trash',
    ]);
    $result = $handler->apply();
    expect($result['count'])->equals(1);
  }

  public function testBulkActionForUnknownSegment() {
    $handler = new BulkAction([
      'listing' => ['filter' => ['segment' => 'this-segment-doesnt-exist']],
      'action' => 'trash',
    ]);
    $result = $handler->apply();
    expect($result)->notEmpty();
  }

  public function testForUnknownSegmentTypeWithoutHandler() {
    $handler = new BulkAction([
      'listing' => ['filter' => ['segment' => $this->segment2->id]],
      'action' => 'trash',
    ]);
    $this->expectException('InvalidArgumentException');
    remove_all_filters('mailpoet_subscribers_in_segment_apply_bulk_action_handlers');
    $handler->apply();
  }

  public function testBulkActionUsingFilter() {
    /** @var MockObject $mock */
    $mock = Stub::makeEmpty('\MailPoet\Test\Segments\SubscribersBulkActionHandlerMock', ['apply']);
    $mock
      ->expects($this->once())
      ->method('apply')
      ->will($this->returnValue('result'));

    remove_all_filters('mailpoet_subscribers_in_segment_apply_bulk_action_handlers');
    (new WPFunctions)->addFilter('mailpoet_subscribers_in_segment_apply_bulk_action_handlers', function () use ($mock) {
      return [$mock];
    });

    $handler = new BulkAction([
      'listing' => ['filter' => ['segment' => $this->segment2->id]],
      'action' => 'trash',
    ]);
    $result = $handler->apply();
    expect($result)->equals('result');
  }
}
