<?php

namespace MailPoet\Test\Models;

use MailPoet\Models\NewsletterPost;
use MailPoetVendor\Carbon\Carbon;
use MailPoetVendor\Idiorm\ORM;

class NewsletterPostTest extends \MailPoetTest {
  public function testItCanGetLatestNewsletterPost() {
    foreach (range(1, 5) as $index) {
      $newsletter_post = NewsletterPost::create();
      $newsletter_post->newsletter_id = 1;
      $newsletter_post->post_id = $index;
      $newsletter_post->save();
      $newsletter_post->created_at = Carbon::now()
        ->addMinutes($index);
      $newsletter_post->save();
    }
    $latest_newsletter_post = NewsletterPost::getNewestNewsletterPost(1);
    expect($latest_newsletter_post->post_id)->equals(5);
  }

  public function _after() {
    ORM::for_table(NewsletterPost::$_table)
      ->deleteMany();
  }
}
