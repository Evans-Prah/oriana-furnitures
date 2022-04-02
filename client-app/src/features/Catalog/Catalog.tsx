import axios from "axios";
import { useEffect, useState } from "react";
import Products from "../../components/Catalog/Products";
import { Product } from "../../models/Product";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5041/api/products/GetProducts")
      .then((res) => setProducts(res.data.data));
  }, []);
  
  return (
    <>
      <Products products={products} />
    </>
  );
};

export default Catalog;
