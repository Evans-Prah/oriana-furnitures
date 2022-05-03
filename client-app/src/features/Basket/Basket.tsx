import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../api/agent";
import { useStoreContext } from "../../context/StoreContext";
import "./Basket.scss";

const Basket = () => {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [loading, setLoading] = useState(false);

  const addItemHandler = (productId: number) => {
    setLoading(true);
    agent.Basket.addItem(productId)
      .then((basket) => {
        setBasket(basket);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const removeItemHandler = (productId: number, quantity = 1) => {
    setLoading(true);
    agent.Basket.removeItem(productId, quantity)
      .then(() => {
        setLoading(false);
        removeItem(productId, quantity);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const subtotal =
    basket?.data?.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500;

  if (!basket || basket?.data?.items?.length === 0)
    return (
      <>
        <h3 className="empty-basket-message">Your basket is empty.</h3>
        <div>
          <Link to="/catalog" className="go-to-catalog">
            Go to Catalog
          </Link>
        </div>
      </>
    );

  return (
    <div className="basket-container">
      <div className="basket-container__items">
        <table className="cart-table" cellSpacing={0}>
          <caption>Cart Items</caption>
          <thead>
            <tr>
              <th className="product-name">Product</th>
              <th className="product-price">Price</th>
              <th className="product-quantity">Quantity</th>
              <th scope="product-subtotal">Subtotal</th>
              <th scope="product-remove">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {basket?.data?.items?.map((item, index) => (
              <tr className="cart-item" key={index}>
                <td className="product-thumbnail">
                  <img
                    src={item.pictureUrl}
                    alt={item.product}
                    width="80"
                    height="70"
                  />
                  <span>{item.product}</span>
                </td>
                <td>GH₵{item.price.toFixed(2)}</td>
                <td>
                  <svg
                    className="minus-icon"
                    onClick={() => removeItemHandler(item.productId)}
                  >
                    <use xlinkHref="./images/sprite.svg#icon-minus"></use>
                  </svg>
                  <span className="quantity">{item.quantity}</span>
                  <svg
                    className="plus-icon"
                    onClick={() => addItemHandler(item.productId)}
                  >
                    <use xlinkHref="./images/sprite.svg#icon-plus"></use>
                  </svg>
                </td>
                <td>GH₵{(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <svg
                    className="trash-icon"
                    onClick={() =>
                      removeItemHandler(item.productId, item.quantity)
                    }
                  >
                    <use xlinkHref="./images/sprite.svg#icon-trash"></use>
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container__summary">
        <h2 className="container__summary-title">Cart Totals</h2>
        <div className="container__summary-subtotal">
          <h4 className="container__summary-subtotal-title">Subtotal</h4>
          <span className="container__summary-subtotal-value">
            GH₵{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="container__summary-delivery-fee">
          <h4 className="container__summary-delivery-fee-title">
            Delivery Fee *
          </h4>
          <span className="container__summary-delivery-fee-value">
            GH₵{deliveryFee.toFixed(2)}
          </span>
        </div>
        <div className="container__summary-total">
          <h4 className="container__summary-total-title">Total</h4>
          <span className="container__summary-total-value">
            GH₵{(subtotal + deliveryFee).toFixed(2)}
          </span>
        </div>
        <div className="checkout">
          <Link className="checkout-btn" to="/checkout">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Basket;
