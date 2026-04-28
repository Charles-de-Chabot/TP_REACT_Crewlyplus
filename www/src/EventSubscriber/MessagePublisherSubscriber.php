<?php

namespace App\EventSubscriber;

use App\Entity\Message;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Message::class)]
class MessagePublisherSubscriber
{
    private HubInterface $hub;
    private SerializerInterface $serializer;

    public function __construct(HubInterface $hub, SerializerInterface $serializer)
    {
        $this->hub = $hub;
        $this->serializer = $serializer;
    }

    public function postPersist(Message $message, LifecycleEventArgs $event): void
    {
        $team = $message->getTeam();
        if (!$team) {
            return;
        }

        // Sérialisation du message avec le groupe de lecture
        $data = $this->serializer->serialize($message, 'json', ['groups' => ['message:read', 'team:read']]);

        // Définition du topic spécifique à la team
        $topic = sprintf('https://crewly.plus/teams/%d/messages', $team->getId());

        // Création de l'update Mercure (Private Update par défaut si configuré)
        $update = new Update(
            $topic,
            $data,
            true // Private update : nécessite un JWT pour s'abonner
        );

        // Publication sur le Hub
        $this->hub->publish($update);
    }
}
