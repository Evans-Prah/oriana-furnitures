import { Product } from "../../models/Product";
import ProductCard from "./ProductCard";
import './Products.scss';

interface Props {
  products: Product[];
}

const Products = (props: Props) => {
  return (
    <>
      <div className="products">
        <div className="product">
          {props.products.map((product) => (
            <ProductCard key={product.productUuid} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
