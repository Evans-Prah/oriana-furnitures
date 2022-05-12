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


DROP TABLE IF EXISTS orf."Baskets";
CREATE TABLE orf."Baskets"
(
    "BasketId"  BIGSERIAL                NOT NULL PRIMARY KEY,
    "BuyerId"   CHARACTER VARYING UNIQUE NOT NULL,
    "DateAdded" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

DROP TABLE IF EXISTS orf."BasketItems";
CREATE TABLE orf."BasketItems"
(
    "BasketItemId" BIGSERIAL NOT NULL PRIMARY KEY,
    "BasketId"     INTEGER   NOT NULL,
    "ProductId"    INTEGER   NOT NULL,
    "Quantity"     INTEGER,
    "DateAdded"    TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    "DateModified" TIMESTAMP WITHOUT TIME ZONE
);

DROP TABLE IF EXISTS orf."UserAccount";
CREATE TABLE orf."UserAccount"
(
    "AccountId"   BIGSERIAL PRIMARY KEY NOT NULL,
    "AccountUuid" CHARACTER VARYING     NOT NULL,
    "Username"    CHARACTER VARYING     NOT NULL,
    "Password"    CHARACTER VARYING     NOT NULL,
    "Email"       CHARACTER VARYING     NOT NULL,
    "PhoneNumber" CHARACTER VARYING     NOT NULL,
    "UserRoleId"  INTEGER,
    "LastLogin"   TIMESTAMP WITHOUT TIME ZONE,
    "IsActive"    BOOLEAN                     DEFAULT TRUE,
    "DateCreated" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);


DROP TABLE IF EXISTS orf."UserRoles";
CREATE TABLE orf."UserRoles"
(
    "RoleId"      SERIAL PRIMARY KEY NOT NULL,
    "Role"        CHARACTER VARYING  NOT NULL,
    "DateCreated" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);




