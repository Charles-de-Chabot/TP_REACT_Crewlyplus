<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260411202032 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id INT AUTO_INCREMENT NOT NULL, house_number VARCHAR(50) DEFAULT NULL, street_name VARCHAR(255) NOT NULL, postcode VARCHAR(15) NOT NULL, city VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE boat (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, used TINYINT NOT NULL, day_price DOUBLE PRECISION NOT NULL, week_price DOUBLE PRECISION NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_active TINYINT NOT NULL, boatinfo_id INT NOT NULL, boat_type_id INT NOT NULL, boat_model_id INT NOT NULL, address_id INT NOT NULL, rental_id INT DEFAULT NULL, INDEX IDX_D86E834AE036D5E3 (boatinfo_id), INDEX IDX_D86E834A3BDC1916 (boat_type_id), INDEX IDX_D86E834AE45950DD (boat_model_id), INDEX IDX_D86E834AF5B7AF75 (address_id), INDEX IDX_D86E834AA7CF2329 (rental_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE boat_info (id INT AUTO_INCREMENT NOT NULL, max_user INT NOT NULL, length DOUBLE PRECISION NOT NULL, width DOUBLE PRECISION NOT NULL, draught DOUBLE PRECISION NOT NULL, cabine_number INT NOT NULL, beds_number INT NOT NULL, fuel VARCHAR(255) DEFAULT NULL, power_engine VARCHAR(255) NOT NULL, irc DOUBLE PRECISION NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE crew (id INT AUTO_INCREMENT NOT NULL, crew_name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE crew_statistic (crew_id INT NOT NULL, statistic_id INT NOT NULL, INDEX IDX_56CAC9655FE259F6 (crew_id), INDEX IDX_56CAC96553B6268F (statistic_id), PRIMARY KEY (crew_id, statistic_id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE fitting (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, fitting_price DOUBLE PRECISION NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE formula (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, formula_price DOUBLE PRECISION NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE formula_boat (formula_id INT NOT NULL, boat_id INT NOT NULL, INDEX IDX_8613FF9A50A6386 (formula_id), INDEX IDX_8613FF9A1E84A29 (boat_id), PRIMARY KEY (formula_id, boat_id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE formula_rental (formula_id INT NOT NULL, rental_id INT NOT NULL, INDEX IDX_1B2610AEA50A6386 (formula_id), INDEX IDX_1B2610AEA7CF2329 (rental_id), PRIMARY KEY (formula_id, rental_id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE innovice (id INT AUTO_INCREMENT NOT NULL, innovice_path VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, user_id INT NOT NULL, INDEX IDX_22C97FABA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE media (id INT AUTO_INCREMENT NOT NULL, media_path VARCHAR(255) NOT NULL, type VARCHAR(50) DEFAULT NULL, user_id INT DEFAULT NULL, boat_id INT DEFAULT NULL, INDEX IDX_6A2CA10CA76ED395 (user_id), INDEX IDX_6A2CA10CA1E84A29 (boat_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, content LONGTEXT NOT NULL, read_at DATETIME NOT NULL, created_at DATETIME NOT NULL, user_id INT DEFAULT NULL, INDEX IDX_B6BD307FA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE model (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, is_open TINYINT NOT NULL, created_at DATETIME NOT NULL, user_id INT DEFAULT NULL, INDEX IDX_BF5476CAA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE rental (id INT AUTO_INCREMENT NOT NULL, rental_start DATETIME NOT NULL, rental_end DATETIME NOT NULL, rental_price DOUBLE PRECISION NOT NULL, user_id INT NOT NULL, INDEX IDX_1619C27DA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE rental_fitting (rental_id INT NOT NULL, fitting_id INT NOT NULL, INDEX IDX_EB61165A7CF2329 (rental_id), INDEX IDX_EB61165C98604CA (fitting_id), PRIMARY KEY (rental_id, fitting_id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE statistic (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, value INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE type (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, nickname VARCHAR(255) DEFAULT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, phone_number VARCHAR(15) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_active TINYINT NOT NULL, position VARCHAR(255) DEFAULT NULL, role_id INT NOT NULL, address_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D649D60322AC (role_id), INDEX IDX_8D93D649F5B7AF75 (address_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8');
        $this->addSql('ALTER TABLE boat ADD CONSTRAINT FK_D86E834AE036D5E3 FOREIGN KEY (boatinfo_id) REFERENCES boat_info (id)');
        $this->addSql('ALTER TABLE boat ADD CONSTRAINT FK_D86E834A3BDC1916 FOREIGN KEY (boat_type_id) REFERENCES type (id)');
        $this->addSql('ALTER TABLE boat ADD CONSTRAINT FK_D86E834AE45950DD FOREIGN KEY (boat_model_id) REFERENCES model (id)');
        $this->addSql('ALTER TABLE boat ADD CONSTRAINT FK_D86E834AF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
        $this->addSql('ALTER TABLE boat ADD CONSTRAINT FK_D86E834AA7CF2329 FOREIGN KEY (rental_id) REFERENCES rental (id)');
        $this->addSql('ALTER TABLE crew_statistic ADD CONSTRAINT FK_56CAC9655FE259F6 FOREIGN KEY (crew_id) REFERENCES crew (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE crew_statistic ADD CONSTRAINT FK_56CAC96553B6268F FOREIGN KEY (statistic_id) REFERENCES statistic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE formula_boat ADD CONSTRAINT FK_8613FF9A50A6386 FOREIGN KEY (formula_id) REFERENCES formula (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE formula_boat ADD CONSTRAINT FK_8613FF9A1E84A29 FOREIGN KEY (boat_id) REFERENCES boat (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE formula_rental ADD CONSTRAINT FK_1B2610AEA50A6386 FOREIGN KEY (formula_id) REFERENCES formula (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE formula_rental ADD CONSTRAINT FK_1B2610AEA7CF2329 FOREIGN KEY (rental_id) REFERENCES rental (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE innovice ADD CONSTRAINT FK_22C97FABA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10CA1E84A29 FOREIGN KEY (boat_id) REFERENCES boat (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rental ADD CONSTRAINT FK_1619C27DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rental_fitting ADD CONSTRAINT FK_EB61165A7CF2329 FOREIGN KEY (rental_id) REFERENCES rental (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE rental_fitting ADD CONSTRAINT FK_EB61165C98604CA FOREIGN KEY (fitting_id) REFERENCES fitting (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649D60322AC FOREIGN KEY (role_id) REFERENCES role (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE boat DROP FOREIGN KEY FK_D86E834AE036D5E3');
        $this->addSql('ALTER TABLE boat DROP FOREIGN KEY FK_D86E834A3BDC1916');
        $this->addSql('ALTER TABLE boat DROP FOREIGN KEY FK_D86E834AE45950DD');
        $this->addSql('ALTER TABLE boat DROP FOREIGN KEY FK_D86E834AF5B7AF75');
        $this->addSql('ALTER TABLE boat DROP FOREIGN KEY FK_D86E834AA7CF2329');
        $this->addSql('ALTER TABLE crew_statistic DROP FOREIGN KEY FK_56CAC9655FE259F6');
        $this->addSql('ALTER TABLE crew_statistic DROP FOREIGN KEY FK_56CAC96553B6268F');
        $this->addSql('ALTER TABLE formula_boat DROP FOREIGN KEY FK_8613FF9A50A6386');
        $this->addSql('ALTER TABLE formula_boat DROP FOREIGN KEY FK_8613FF9A1E84A29');
        $this->addSql('ALTER TABLE formula_rental DROP FOREIGN KEY FK_1B2610AEA50A6386');
        $this->addSql('ALTER TABLE formula_rental DROP FOREIGN KEY FK_1B2610AEA7CF2329');
        $this->addSql('ALTER TABLE innovice DROP FOREIGN KEY FK_22C97FABA76ED395');
        $this->addSql('ALTER TABLE media DROP FOREIGN KEY FK_6A2CA10CA76ED395');
        $this->addSql('ALTER TABLE media DROP FOREIGN KEY FK_6A2CA10CA1E84A29');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FA76ED395');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAA76ED395');
        $this->addSql('ALTER TABLE rental DROP FOREIGN KEY FK_1619C27DA76ED395');
        $this->addSql('ALTER TABLE rental_fitting DROP FOREIGN KEY FK_EB61165A7CF2329');
        $this->addSql('ALTER TABLE rental_fitting DROP FOREIGN KEY FK_EB61165C98604CA');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649D60322AC');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649F5B7AF75');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE boat');
        $this->addSql('DROP TABLE boat_info');
        $this->addSql('DROP TABLE crew');
        $this->addSql('DROP TABLE crew_statistic');
        $this->addSql('DROP TABLE fitting');
        $this->addSql('DROP TABLE formula');
        $this->addSql('DROP TABLE formula_boat');
        $this->addSql('DROP TABLE formula_rental');
        $this->addSql('DROP TABLE innovice');
        $this->addSql('DROP TABLE media');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE model');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE rental');
        $this->addSql('DROP TABLE rental_fitting');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE statistic');
        $this->addSql('DROP TABLE type');
        $this->addSql('DROP TABLE user');
    }
}
