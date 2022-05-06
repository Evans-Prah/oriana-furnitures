import { Product } from "../../models/Product";
import ProductCard from "./ProductCard";
import './Products.scss';

interface Props {
  products: Product[] | undefined;
}

const Products = (props: Props) => {
  return (
    <>
      <div className="products">
        <div className="product">
          {props.products?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
