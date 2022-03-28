DROP TABLE IF EXISTS orf."Products";
CREATE TABLE orf."Products"
(
    "ProductId"       BIGSERIAL                NOT NULL PRIMARY KEY,
    "ProductUuid"     CHARACTER VARYING UNIQUE NOT NULL,
    "Name"            CHARACTER VARYING        NOT NULL,
    "Description"     CHARACTER VARYING        NOT NULL,
    "Price"           BIGINT                   NOT NULL,
    "PictureUrl"      CHARACTER VARYING,
    "Type"            CHARACTER VARYING        NOT NULL,
    "Brand"           CHARACTER VARYING        NOT NULL,
    "QuantityInStock" INTEGER                  NOT NULL
);