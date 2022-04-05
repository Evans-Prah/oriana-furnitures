DROP FUNCTION IF EXISTS orf."GetProducts"();
CREATE FUNCTION orf."GetProducts"()
    RETURNS TABLE
            (
                "ProductUuid"     CHARACTER VARYING,
                "Name"            CHARACTER VARYING,
                "Description"     CHARACTER VARYING,
                "Price"           BIGINT,
                "PictureUrl"      CHARACTER VARYING,
                "Category"        CHARACTER VARYING,
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
                        ca."Category",
                        br."Brand",
                        pro."QuantityInStock"
                 FROM orf."Products" pro
                          LEFT JOIN orf."Categories" ca ON pro."CategoryId" = ca."CategoryId"
                          LEFT JOIN orf."Brands" br ON pro."BrandId" = br."BrandId";
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
                "Category"        CHARACTER VARYING,
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
                        ca."Category",
                        br."Brand",
                        pro."QuantityInStock"
                 FROM orf."Products" pro
                          LEFT JOIN orf."Categories" ca ON pro."CategoryId" = ca."CategoryId"
                          LEFT JOIN orf."Brands" br ON pro."BrandId" = br."BrandId"
                 WHERE pro."ProductUuid" = "reqProductUuid";
END
$$;


DROP FUNCTION IF EXISTS orf."GetProductReviews"(CHARACTER VARYING);
CREATE FUNCTION orf."GetProductReviews"("reqProductUuid" CHARACTER VARYING)
    RETURNS TABLE
            (
                "ReviewUuid"   CHARACTER VARYING,
                "Name"         CHARACTER VARYING,
                "Rating"       INTEGER,
                "Review"       CHARACTER VARYING,
                "ReviewedDate" CHARACTER VARYING
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    _product_id INTEGER;
BEGIN

    SELECT pr."ProductId" INTO _product_id FROM orf."Products" pr WHERE pr."ProductUuid" = "reqProductUuid" LIMIT 1;


    RETURN QUERY SELECT re."ReviewUuid",
                        re."Name",
                        re."Rating"::INTEGER,
                        re."Review",
                        TO_CHAR(re."DateAdded", 'DD-MM-YYYY')::CHARACTER VARYING
                 FROM orf."Reviews" re
                 WHERE re."ProductId" = _product_id
                 ORDER BY re."Rating" DESC
                 LIMIT 20;
END
$$;


DROP FUNCTION IF EXISTS orf."GetTotalProductReviews"(CHARACTER VARYING);
CREATE FUNCTION orf."GetTotalProductReviews"("reqProductUuid" CHARACTER VARYING)
    RETURNS TABLE
            (
                "Message"       CHARACTER VARYING,
                "Total"         INTEGER,
                "AverageRating" INTEGER
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    _product_id INTEGER;
BEGIN

    SELECT pr."ProductId"
    INTO _product_id
    FROM orf."Reviews" r
             LEFT JOIN orf."Products" pr ON r."ProductId" = pr."ProductId"
    WHERE pr."ProductUuid" = "reqProductUuid"
    LIMIT 1;

    IF _product_id IS NULL THEN
        RETURN QUERY SELECT 'Product has no reviews'::CHARACTER VARYING, 0, 0;
        RETURN;
    end if;

    RETURN QUERY SELECT ''::CHARACTER VARYING,
                        (COUNT(re."ReviewId"))::INTEGER,
                        (SUM(re."Rating") / COUNT(re."ReviewId")::INTEGER)::INTEGER
                 FROM orf."Reviews" re
                 WHERE re."ProductId" = _product_id;
END
$$;

