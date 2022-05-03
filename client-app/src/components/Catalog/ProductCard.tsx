import React, { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../api/agent";
import { useStoreContext } from "../../context/StoreContext";
import { Product } from "../../models/Product";
import "./ProductCard.scss";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const [loading, setLoading] = useState(false);
  const { setBasket } = useStoreContext();

  const addItemHandler = (productId: number) => {
    setLoading(true);
    agent.Basket.addItem(productId)
      .then((res) => {
        setLoading(false);
        setBasket(res);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

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
            GH₵ {product.price.toFixed(2)}
          </h4>
          <h4 className="product-card__details-brand">
            Brand: {product.brand}
          </h4>
          <h4 className="product-card__details-type">
            Type: {product.category}
          </h4>
        </div>
        <div className="product-card__btns">
          <button
            className="btn product-card__btns-add-btn"
            onClick={() => addItemHandler(product.productId)}
          >
            Add to Cart
          </button>
          <Link
            className="btn product-card__btns-view-btn"
            to={`/catalog/${product.productUuid}`}
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
