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
                
                // Assigner le poste (Profil ou Équipier par défaut)
                $userPosLabel = $user->getPosition();
                $targetPos = null;

                if ($userPosLabel) {
                    $targetPos = $this->positionRepository->findOneBy(['label' => $userPosLabel]);
                }

                if (!$targetPos) {
                    $targetPos = $this->positionRepository->findOneBy(['label' => 'Équipier']);
                }

                if ($targetPos) {
                    foreach ($data->getMemberships() as $membership) {
                        if ($membership->getUser() === $user) {
                            $membership->setPosition($targetPos);
                            $user->setPosition($targetPos->getLabel());
                        }
                    }
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
