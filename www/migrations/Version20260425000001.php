<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration: Add crewMembers ManyToMany relation and status field to Rental.
 *
 * Changes:
 * - Creates pivot table `rental_crew` (rental_id, user_id)
 * - Adds column `status` (VARCHAR 50, default 'pending') to `rental`
 */
final class Version20260425000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add crewMembers ManyToMany (rental_crew) and status field to rental table';
    }

    public function up(Schema $schema): void
    {
        // Create pivot table for crew members assigned to a rental
        $this->addSql('CREATE TABLE rental_crew (
            rental_id INT NOT NULL,
            user_id   INT NOT NULL,
            INDEX IDX_RENTAL_CREW_RENTAL (rental_id),
            INDEX IDX_RENTAL_CREW_USER   (user_id),
            PRIMARY KEY (rental_id, user_id)
        ) DEFAULT CHARACTER SET utf8');

        // Add foreign keys on the pivot table
        $this->addSql('ALTER TABLE rental_crew
            ADD CONSTRAINT FK_RENTAL_CREW_RENTAL FOREIGN KEY (rental_id) REFERENCES rental (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE rental_crew
            ADD CONSTRAINT FK_RENTAL_CREW_USER FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');

        // Add status column to rental (pending by default, updated by Stripe webhook)
        $this->addSql("ALTER TABLE rental
            ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'
            AFTER rental_price");
    }

    public function down(Schema $schema): void
    {
        // Remove foreign keys before dropping the pivot table
        $this->addSql('ALTER TABLE rental_crew DROP FOREIGN KEY FK_RENTAL_CREW_RENTAL');
        $this->addSql('ALTER TABLE rental_crew DROP FOREIGN KEY FK_RENTAL_CREW_USER');

        // Drop pivot table
        $this->addSql('DROP TABLE rental_crew');

        // Remove status column from rental
        $this->addSql('ALTER TABLE rental DROP COLUMN status');
    }
}
