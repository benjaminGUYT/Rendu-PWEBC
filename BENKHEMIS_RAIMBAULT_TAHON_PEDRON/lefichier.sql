SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS GARE ;
CREATE TABLE GARE (
    codeUIC INT NOT NULL,
    fret BIT(1) NOT NULL,
    voyageurs BIT(1) NOT NULL,
    codeLigne MEDIUMINT(6) NOT NULL,
	libelle varchar(255) NOT NULL,
    commune varchar(255) NOT NULL,
    departement varchar(255) NOT NULL,
    x real NOT NULL,
    y real NOT NULL,
    PRIMARY KEY (codeUIC, codeLigne)
);

DROP TABLE IF EXISTS OBJETSTROUVES ;
CREATE TABLE OBJETSTROUVES (
    id varchar(255) NOT NULL,
    code_uic varchar(255) NOT NULL,
    nature varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
	date datetime NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS VOIE;
CREATE TABLE VOIE (
    id varchar(255) NOT NULL,
    libelle varchar(255) NOT NULL,
    codeLigne MEDIUMINT(6) NOT NULL,
    coordonees text(21844) NOT NULL,
    primary key (id)
);