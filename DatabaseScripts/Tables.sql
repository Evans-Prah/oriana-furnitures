DROP TABLE IF EXISTS orf."Products";
CREATE TABLE orf."Products"
(
    "ProductId"       BIGSERIAL                NOT NULL PRIMARY KEY,
    "ProductUuid"     CHARACTER VARYING UNIQUE NOT NULL,
    "Name"            CHARACTER VARYING        NOT NULL,
    "Description"     CHARACTER VARYING        NOT NULL,
    "Price"           BIGINT                   NOT NULL,
    "PictureUrl"      CHARACTER VARYING,
    "CategoryId"      INTEGER                  NOT NULL,
    "BrandId"         INTEGER                  NOT NULL,
    "QuantityInStock" INTEGER                  NOT NULL,
    "DateAdded"       TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    "DateModified"    TIMESTAMP WITHOUT TIME ZONE
);

DROP TABLE IF EXISTS orf."Brands";
CREATE TABLE orf."Brands"
(
    "BrandId"      BIGSERIAL                NOT NULL PRIMARY KEY,
    "BrandUuid"    CHARACTER VARYING UNIQUE NOT NULL,
    "Brand"        CHARACTER VARYING        NOT NULL,
    "DateAdded"    TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    "DateModified" TIMESTAMP WITHOUT TIME ZONE
);

DROP TABLE IF EXISTS orf."Categories";
CREATE TABLE orf."Categories"
(
    "CategoryId"   BIGSERIAL                NOT NULL PRIMARY KEY,
    "CategoryUuid" CHARACTER VARYING UNIQUE NOT NULL,
    "Category"     CHARACTER VARYING        NOT NULL,
    "DateAdded"    TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    "DateModified" TIMESTAMP WITHOUT TIME ZONE
);

DROP TABLE IF EXISTS orf."Reviews";
CREATE TABLE orf."Reviews"
(
    "ReviewId"   BIGSERIAL                NOT NULL PRIMARY KEY,
    "ReviewUuid" CHARACTER VARYING UNIQUE NOT NULL,
    "ProductId"  INTEGER                  NOT NULL,
    "Name"       CHARACTER VARYING        NOT NULL,
    "Email"      CHARACTER VARYING,
    "Rating"     DECIMAL CHECK ( "Rating" BETWEEN 1 AND 5),
    "Review"     CHARACTER VARYING        NOT NULL,
    "DateAdded"  TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);