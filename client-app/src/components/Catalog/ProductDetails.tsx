import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../api/agent";
import { useStoreContext } from "../../context/StoreContext";
import { Product } from "../../models/Product";
import { Review, Rating } from "../../models/Review";
import LoadingComponent from "../Layout/LoadingComponent";
import NotFound from "../Layout/NotFound";
import "./ProductDetails.scss";
import ProductReview from "./ProductReview";

const ProductDetails = () => {
  const { basket, setBasket, removeItem } = useStoreContext();
  const { productUuid } = useParams<{ productUuid: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalRating, setTotalRating] = useState<Rating>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const item = basket?.data?.items;
  const basketItem = basket?.data?.items.find(
    (i) => i.productId === product?.productId
  );

  function handleInputChange(event: any) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  useEffect(() => {
    if (basketItem) setQuantity(basketItem.quantity);
    agent.Catalog.getProduct(productUuid!)
      .then((res) => {
        if (res) {
          setLoading(false);
          setProduct(res);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  }, [productUuid, basketItem]);

  useEffect(() => {
    agent.Reviews.getProductReviews(productUuid!)
      .then((res) => {
        if (res) {
          setLoading(false);
          setReviews(res);
        } else {
          console.log(res);
        }
      })
      .catch((error) => console.log(error));
  }, [productUuid]);

  useEffect(() => {
    agent.Reviews.getTotalProductReviews(productUuid!)
      .then((res) => {
        if (res) {
          setLoading(false);
          setTotalRating(res);
        } else {
          console.log(res);
        }
      })
      .catch((error) => console.log(error));
  }, [productUuid]);

  const handleUpdateCart = () => {
    setSubmitting(true);
    if (!basketItem || quantity > basketItem.quantity) {
      const updatedQuantity = basketItem
        ? quantity - basketItem.quantity
        : quantity;
      agent.Basket.addItem(product?.productId!, updatedQuantity)
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setSubmitting(false));
    } else {
      const updatedQuantity = basketItem.quantity - quantity;
      agent.Basket.removeItem(product?.productId!, updatedQuantity)
        .then(() => removeItem(product?.productId!, updatedQuantity))
        .catch((error) => console.log(error))
        .finally(() => setSubmitting(false));
    }
  };

  if (loading) return <LoadingComponent />;

  if (!product) return <NotFound />;

  return (
    <div className="container">
      <div className="container__product-img">
        <img src={product.pictureUrl} alt={product.name} />
      </div>
      <div className="container__product-details">
        <h2 className="container__product-details-name">{product.name}</h2>

        <h4 className="container__product-details-price">
          GH₵ {product.price.toFixed(2)}
        </h4>
        <hr />
        <p className="container__product-details-description">
          {product.description}. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quae, doloremque ipsam sunt deserunt ea maiores
          repellendus a at rem vero ex harum ab earum quod iusto quas nostrum
          voluptas quos? Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Vero iure nesciunt impedit similique unde accusantium, ducimus
          rem quod nostrum rerum sint error accusamus magni aut excepturi
          laudantium ullam sed deserunt.
        </p>
        <hr />
        <h3 className="container__product-details-type">
          Type: {product.category}
        </h3>
        <h3 className="container__product-details-brand">
          Brand: {product.brand}
        </h3>
        <h3 className="container__product-details-quantity">
          Quantity In Stock: {product.quantityInStock}
        </h3>
        <hr />
        <div className="container__product-details-cart-section">
          <label
            htmlFor=""
            className="container__product-details-cart-section-label"
          >
            Quantity in Cart
          </label>
          <input
            type="number"
            className="container__product-details-cart-section-input"
            name="quantity"
            value={quantity}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="cartBtn"
            onClick={handleUpdateCart}
            disabled={
              basketItem?.quantity === quantity || (!item && quantity === 0)
            }
          >
            {basketItem ? "Update Quantity" : "Add to Cart"}
          </button>
        </div>
      </div>
      <div className="container__product-reviews">
        <h2 className="container__product-reviews-total">
          Customer Reviews ({totalRating?.total})
          {new Array(totalRating?.averageRating).fill(null).map((_, index) => (
            <span
              className="container__product-reviews-averageRating"
              key={index}
            >
              &#9733;
            </span>
          ))}
        </h2>
        <hr />
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ProductReview key={review.reviewUuid} review={review} />
          ))
        ) : (
          <h2>There are no reviews for this product</h2>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
