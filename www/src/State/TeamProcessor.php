<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Team;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class TeamProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private \App\Repository\PositionRepository $positionRepository,
        private Security $security
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Team && $operation->getMethod() === 'POST') {
            // Générer un code d'invitation unique si non présent
            if (!$data->getInviteCode()) {
                $data->setInviteCode('CREW-' . strtoupper(substr(md5(uniqid()), 0, 5)));
            }

            // Définir le leader comme l'utilisateur connecté
            $user = $this->security->getUser();
            if ($user && !$data->getLeader()) {
                $data->setLeader($user);
                $data->addMember($user); // Le leader est aussi membre
                
                // Assigner le poste "Équipier" par défaut au leader
                $equipierPos = $this->positionRepository->findOneBy(['label' => 'Équipier']);
                if ($equipierPos) {
                    foreach ($data->getMemberships() as $membership) {
                        if ($membership->getUser() === $user) {
                            $membership->setPosition($equipierPos);
                        }
                    }
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
