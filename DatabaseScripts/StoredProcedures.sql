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



DROP FUNCTION IF EXISTS orf."GetBasket"(CHARACTER VARYING);
CREATE FUNCTION orf."GetBasket"("reqBuyerId" CHARACTER VARYING)
    RETURNS TABLE
            (
                "BasketId" INTEGER,
                "BuyerId"  CHARACTER VARYING,
                "Items"    JSONB

            )
    LANGUAGE plpgsql
AS
$$
BEGIN

    RETURN QUERY SELECT ba."BasketId"::INTEGER,
                        ba."BuyerId",
                        (SELECT jsonb_agg(v) FROM orf."GetBasketItems"(ba."BasketId"::INTEGER) v)::JSONB
                 FROM orf."Baskets" ba
                 WHERE ba."BuyerId" = "reqBuyerId";
END
$$;


DROP FUNCTION IF EXISTS orf."GetBasketItems"(INTEGER);
CREATE FUNCTION orf."GetBasketItems"("reqBasketId" INTEGER)
    RETURNS TABLE
            (
                "ProductUuid" CHARACTER VARYING,
                "Product"     CHARACTER VARYING,
                "Brand"       CHARACTER VARYING,
                "Category"    CHARACTER VARYING,
                "Price"       BIGINT,
                "Quantity"    INTEGER,
                "PictureUrl"  CHARACTER VARYING
            )
    LANGUAGE plpgsql
AS
$$
BEGIN

    RETURN QUERY SELECT pr."ProductUuid",
                        pr."Name",
                        br."Brand",
                        ca."Category",
                        pr."Price",
                        bi."Quantity",
                        pr."PictureUrl"
                 FROM orf."BasketItems" bi
                          LEFT JOIN orf."Products" pr ON bi."ProductId" = pr."ProductId"
                          LEFT JOIN orf."Brands" br ON pr."BrandId" = br."BrandId"
                          LEFT JOIN orf."Categories" ca ON pr."CategoryId" = ca."CategoryId"
                 WHERE bi."BasketId" = "reqBasketId";
END
$$;


DROP FUNCTION IF EXISTS orf."AddItemToBasket"(CHARACTER VARYING, CHARACTER VARYING, INTEGER);
CREATE FUNCTION orf."AddItemToBasket"("reqProductUuid" CHARACTER VARYING,
                                      "reqBuyerId" CHARACTER VARYING,
                                      "reqQuantity" INTEGER)
    RETURNS TABLE
            (
                "Message"      CHARACTER VARYING,
                "ResponseCode" INTEGER,
                "Items"        JSONB
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    _product_id     INTEGER;
    _basket_id      INTEGER;
    _item_id        INTEGER;
    _basket         RECORD;
BEGIN

    SELECT * FROM orf."GetBasket"("reqBuyerId") INTO _basket;

    IF _basket IS NULL THEN
        INSERT INTO orf."Baskets"("BuyerId")
        VALUES ("reqBuyerId")
        RETURNING "BasketId"::INTEGER INTO _basket_id;
    END IF;

    SELECT p."ProductId"
    INTO _product_id
    FROM orf."Products" p
    WHERE p."ProductUuid" = "reqProductUuid"
    LIMIT 1;

    IF _product_id IS NULL THEN
        RETURN QUERY SELECT 'Product does not exist, check and try again.'::CHARACTER VARYING,
                            100, -- Code 100: Invalid product
                            NULL::JSONB;
        RETURN;
    END IF;


    SELECT b."BasketId"::INTEGER INTO _basket_id FROM orf."Baskets" b WHERE b."BuyerId" = "reqBuyerId" LIMIT 1;

    IF _basket_id IS NOT NULL THEN
        UPDATE orf."Baskets" SET "BuyerId" = "reqBuyerId" WHERE "BuyerId" = "reqBuyerId";
    END IF;

    SELECT bi."BasketItemId"
    INTO _item_id
    FROM orf."BasketItems" bi
    WHERE bi."ProductId" = _product_id
      AND bi."BasketId" = _basket_id
    LIMIT 1;

    IF _item_id IS NOT NULL THEN

        UPDATE orf."BasketItems"
        SET "Quantity"     = orf."BasketItems"."Quantity" + "reqQuantity",
            "DateModified" = NOW() AT TIME ZONE 'UTC'
        WHERE "BasketItemId" = _item_id;

        RETURN QUERY SELECT 'Item quantity has been increased in basket successfully'::CHARACTER VARYING,
                            105, -- Code 105: cart item updated
                            (SELECT jsonb_agg(v) FROM orf."GetBasketItems"(_basket_id) v)::JSONB;
        RETURN;
    END IF;

    INSERT INTO orf."BasketItems"("BasketId", "ProductId", "Quantity")
    VALUES (_basket_id, _product_id, "reqQuantity");

    RETURN QUERY SELECT 'Item added to cart successfully'::CHARACTER VARYING,
                        110, -- Code 100: new item added
                        (SELECT jsonb_agg(v) FROM orf."GetBasketItems"(_basket_id) v)::JSONB;
END
$$;


DROP FUNCTION IF EXISTS orf."RemoveItemFromBasket"(CHARACTER VARYING, CHARACTER VARYING, INTEGER);
CREATE FUNCTION orf."RemoveItemFromBasket"("reqProductUuid" CHARACTER VARYING, "reqBuyerId" CHARACTER VARYING,
                                           "reqQuantity" INTEGER)
    RETURNS TABLE
            (
                "Message"      CHARACTER VARYING,
                "ResponseCode" INTEGER
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    _product_id INTEGER;
    _item_id    INTEGER;
    _quantity   INTEGER;
    _basket     RECORD;
BEGIN

    SELECT * FROM orf."GetBasket"("reqBuyerId") INTO _basket;

    IF _basket IS NULL THEN
        RETURN QUERY SELECT 'Basket not found, check and try again'::CHARACTER VARYING, 400; -- Code 400: no basket
        RETURN;
    end if;

    SELECT p."ProductId" INTO _product_id FROM orf."Products" p WHERE p."ProductUuid" = "reqProductUuid" LIMIT 1;

    IF _product_id IS NULL THEN
        RETURN QUERY SELECT 'Product does not exist, check and try again.'::CHARACTER VARYING,
                            401; -- Code 401: Invalid product
        RETURN;
    END IF;

    SELECT bi."BasketItemId", bi."Quantity"
    INTO _item_id, _quantity
    FROM orf."BasketItems" bi
             LEFT JOIN orf."Products" pr ON bi."ProductId" = pr."ProductId"
             LEFT JOIN orf."Baskets" ba ON bi."BasketId" = ba."BasketId"
    WHERE bi."ProductId" = _product_id
      AND ba."BuyerId" = "reqBuyerId"
    LIMIT 1;

    IF _quantity < "reqQuantity" THEN
        RETURN QUERY SELECT 'Item quantity cannot be reduced - insufficient quantity, check and try again'::CHARACTER VARYING,
                            402; -- Code 402: Insufficient quantity
        RETURN;
    end if;


    IF _item_id IS NULL THEN
        RETURN QUERY SELECT 'Item does not exist in basket'::CHARACTER VARYING, 404; -- Code 404: Item not found
    END IF;

    UPDATE orf."BasketItems"
    SET "Quantity"     = "Quantity" - "reqQuantity",
        "DateModified" = NOW() AT TIME ZONE 'UTC'
    WHERE "BasketItemId" = _item_id;

    DELETE FROM orf."BasketItems" WHERE "BasketItemId" = _item_id AND "Quantity" = 0;

    RETURN QUERY SELECT 'Item quantity has been reduced in basket successfully'::CHARACTER VARYING,
                        410; -- Code 410: Item quantity reduced


END
$$;


