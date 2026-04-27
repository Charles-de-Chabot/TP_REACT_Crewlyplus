<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260427082227 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE regatta (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, location VARCHAR(255) NOT NULL, start_date DATETIME NOT NULL, end_date DATETIME NOT NULL, registration_price DOUBLE PRECISION DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE sailing_profile (id INT AUTO_INCREMENT NOT NULL, miles_sailed INT DEFAULT NULL, boat_types JSON DEFAULT NULL, achievements JSON DEFAULT NULL, current_position VARCHAR(255) DEFAULT NULL, user_id INT NOT NULL, UNIQUE INDEX UNIQ_3996C85AA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE team (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, provisioning_list JSON DEFAULT NULL, regatta_id INT NOT NULL, leader_id INT NOT NULL, INDEX IDX_C4E0A61F76569257 (regatta_id), INDEX IDX_C4E0A61F73154ED4 (leader_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE user_regatta (user_id INT NOT NULL, regatta_id INT NOT NULL, INDEX IDX_6C398814A76ED395 (user_id), INDEX IDX_6C39881476569257 (regatta_id), PRIMARY KEY (user_id, regatta_id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('ALTER TABLE sailing_profile ADD CONSTRAINT FK_3996C85AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F76569257 FOREIGN KEY (regatta_id) REFERENCES regatta (id)');
        $this->addSql('ALTER TABLE team ADD CONSTRAINT FK_C4E0A61F73154ED4 FOREIGN KEY (leader_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_regatta ADD CONSTRAINT FK_6C398814A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_regatta ADD CONSTRAINT FK_6C39881476569257 FOREIGN KEY (regatta_id) REFERENCES regatta (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD current_team_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64983615D2B FOREIGN KEY (current_team_id) REFERENCES team (id)');
        $this->addSql('CREATE INDEX IDX_8D93D64983615D2B ON user (current_team_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE sailing_profile DROP FOREIGN KEY FK_3996C85AA76ED395');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F76569257');
        $this->addSql('ALTER TABLE team DROP FOREIGN KEY FK_C4E0A61F73154ED4');
        $this->addSql('ALTER TABLE user_regatta DROP FOREIGN KEY FK_6C398814A76ED395');
        $this->addSql('ALTER TABLE user_regatta DROP FOREIGN KEY FK_6C39881476569257');
        $this->addSql('DROP TABLE regatta');
        $this->addSql('DROP TABLE sailing_profile');
        $this->addSql('DROP TABLE team');
        $this->addSql('DROP TABLE user_regatta');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64983615D2B');
        $this->addSql('DROP INDEX IDX_8D93D64983615D2B ON user');
        $this->addSql('ALTER TABLE user DROP current_team_id');
    }
}
