import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../models/Product";

import "./ProductDetails.scss";

const ProductDetails = () => {
  const { productUuid } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5041/api/products/GetProduct/${productUuid}`)
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          setProduct(res.data.data);
        } else {
          setLoading(false);
          console.log(res.data.responseMessage);
        }
      })
      .catch((error) => console.log(error));
  }, [productUuid]);

  if (loading) return <h3>Loading...</h3>;

  if (!product) return <h3>Product not found</h3>;

  return (
    <div className="container">
      <div className="container__product-img">
        <img src={product.pictureUrl} alt={product.name} />
      </div>
      <div className="container__product-details">
        <h2 className="container__product-details-name">{product.name}</h2>

        <h4 className="container__product-details-price">
          GH {product.price.toFixed(2)}
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
          Type: {product.type}
        </h3>
        <h3 className="container__product-details-brand">
          Brand: {product.brand}
        </h3>
        <h3 className="container__product-details-quantity">
          Quantity In Stock: {product.quantityInStock}
        </h3>
        <hr />
      </div>
    </div>
  );
};

export default ProductDetails;
