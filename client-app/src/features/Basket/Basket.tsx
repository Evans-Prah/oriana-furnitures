import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../api/agent";
import { useStoreContext } from "../../context/StoreContext";
import "./Basket.scss";

const Basket = () => {
  const { basket, setBasket, removeItem} = useStoreContext();
  const [loading, setLoading] = useState(false);

  const addItemHandler = (productUuid: string) => {
    setLoading(true);
    agent.Basket.addItem(productUuid).then(basket => {
      setBasket(basket)
    }).catch(err => {
      setLoading(false);
      console.log(err);
    });
  }

  const removeItemHandler = (productUuid: string, quantity = 1) => {
    setLoading(true);
    agent.Basket.removeItem(productUuid, quantity).then(()=> {
      setLoading(false);
      removeItem(productUuid, quantity);
    }).catch(err => {
      setLoading(false);
      console.log(err);
    })
  }


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
                    onClick={() => removeItemHandler(item.productUuid)}
                  >
                    <use xlinkHref="./images/sprite.svg#icon-minus"></use>
                  </svg>
                  <span className="quantity">{item.quantity}</span>
                  <svg
                    className="plus-icon"
                    onClick={() => addItemHandler(item.productUuid)}
                  >
                    <use xlinkHref="./images/sprite.svg#icon-plus"></use>
                  </svg>
                </td>
                <td>GH₵{(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <svg
                    className="trash-icon"
                    onClick={() =>
                      removeItemHandler(item.productUuid, item.quantity)
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
        <h2>Summary</h2>
      </div>
    </div>
  );
};

export default Basket;
