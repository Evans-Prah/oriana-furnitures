import { useEffect, useState } from "react";
import Products from "../../components/Catalog/Products";
import LoadingComponent from "../../components/Layout/LoadingComponent";
import agent from "../../api/agent";
import { Product } from "../../models/Product";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.getProducts()
      .then((products) => setProducts(products))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent message="Loading products..." />;

  return (
    <>
      <Products products={products} />
    </>
  );
};

export default Catalog;
