import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../models/Product";
import "./ProductCard.scss";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <>
      <div className="product-card">
        <img
          src={product.pictureUrl}
          alt="Product"
          className="product-card__img"
        />
        <div className="product-card__details">
          <h3 className="product-card__details-name">{product.name}</h3>
          <h4 className="product-card__details-price">
            GH {product.price.toFixed(2)}
          </h4>
          <h4 className="product-card__details-brand">
            Brand: {product.brand}
          </h4>
          <h4 className="product-card__details-type">Type: {product.type}</h4>
        </div>
        <div className="product-card__btns">
          <button className="btn product-card__btns-add-btn">
            Add to Cart
          </button>
          <Link
            className="btn product-card__btns-view-btn"
            to={`/catalog/${product.productUuid}`}
          >
            View Details  &rarr;
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
