<?php

namespace App\Message;

class WindShiftAlert
{
    public function __construct(
        private int $regattaId
    ) {
    }

    public function getRegattaId(): int
    {
        return $this->regattaId;
    }
}
