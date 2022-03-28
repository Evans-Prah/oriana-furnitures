DROP FUNCTION IF EXISTS orf."GetProducts"();
CREATE FUNCTION orf."GetProducts"()
    RETURNS TABLE
            (
                "ProductUuid"     CHARACTER VARYING,
                "Name"            CHARACTER VARYING,
                "Description"     CHARACTER VARYING,
                "Price"           BIGINT,
                "PictureUrl"      CHARACTER VARYING,
                "Type"            CHARACTER VARYING,
                "Brand"           CHARACTER VARYING,
                "QuantityInStock" INTEGER
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY SELECT pro."ProductUuid",
                        pro."Name",
                        pro."Description",
                        pro."Price",
                        pro."PictureUrl",
                        pro."Type",
                        pro."Brand",
                        pro."QuantityInStock"
                 FROM orf."Products" pro;
END
$$;

DROP FUNCTION IF EXISTS orf."GetProduct"(CHARACTER VARYING);
CREATE FUNCTION orf."GetProduct"("reqProductUuid" CHARACTER VARYING)
    RETURNS TABLE
            (
                "Name"            CHARACTER VARYING,
                "Description"     CHARACTER VARYING,
                "Price"           BIGINT,
                "PictureUrl"      CHARACTER VARYING,
                "Type"            CHARACTER VARYING,
                "Brand"           CHARACTER VARYING,
                "QuantityInStock" INTEGER
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY SELECT pro."Name",
                        pro."Description",
                        pro."Price",
                        pro."PictureUrl",
                        pro."Type",
                        pro."Brand",
                        pro."QuantityInStock"
                 FROM orf."Products" pro
                 WHERE pro."ProductUuid" = "reqProductUuid";
END
$$;