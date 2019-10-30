<?php

namespace MailPoet\Cron\Workers\StatsNotifications;

use Carbon\Carbon;
use MailPoet\Doctrine\Repository;
use MailPoet\Entities\NewsletterEntity;
use MailPoet\Entities\ScheduledTaskEntity;
use MailPoet\Entities\StatsNotificationEntity;

class StatsNotificationsRepository extends Repository {
  protected function getEntityClassName() {
    return StatsNotificationEntity::class;
  }

  /**
   * @param int $newsletter_id
   * @return StatsNotificationEntity|null
   */
  public function findByNewsletterId($newsletter_id) {
    return $this->doctrine_repository
      ->createQueryBuilder('stn')
      ->join('stn.newsletter', 'n')
      ->andWhere('n.id = :newsletterId')
      ->setParameter('newsletterId', $newsletter_id)
      ->setMaxResults(1)
      ->getQuery()
      ->getOneOrNullResult();
  }

  /**
   * @param int|null $limit
   * @return StatsNotificationEntity[]
   */
  public function findDueTasks($limit = null) {
    $date = new Carbon();
    $query = $this->doctrine_repository
      ->createQueryBuilder('stn')
      ->join('stn.task', 'tasks')
      ->join('stn.newsletter', 'n')
      ->addSelect('tasks')
      ->addSelect('n')
      ->addOrderBy('tasks.priority')
      ->addOrderBy('tasks.updated_at')
      ->where('tasks.deleted_at IS NULL')
      ->andWhere('tasks.status = :status')
      ->setParameter('status', ScheduledTaskEntity::STATUS_SCHEDULED)
      ->andWhere('tasks.scheduled_at < :date')
      ->setParameter('date', $date)
      ->andWhere('tasks.type = :workerType')
      ->setParameter('workerType', Worker::TASK_TYPE);
    if (is_int($limit)) {
      $query->setMaxResults($limit);
    }
    return $query->getQuery()->getResult();
  }

  /**
   * @return NewsletterEntity[]
   */
  public function getDueAutomatedNewsletters() {
    return $this->entity_manager
      ->createQueryBuilder()
      ->select('n')
      ->from(NewsletterEntity::class, 'n')
      ->where('n.status = :status')
      ->setParameter(':status', NewsletterEntity::STATUS_ACTIVE)
      ->andWhere('n.deleted_at is null')
      ->andWhere('n.type IN (:types)')
      ->setParameter('types', [NewsletterEntity::TYPE_AUTOMATIC, NewsletterEntity::TYPE_WELCOME])
      ->orderBy('n.subject')
      ->getQuery()
      ->getResult();
  }

}
