import { useEffect } from "react";
import Products from "../../components/Catalog/Products";
import LoadingComponent from "../../components/Layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchProductsAsync } from "../../store/catalogSlice";

const Catalog = () => {
  const {catalog, status} = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsAsync())
  }, [dispatch]);

  if (status.includes('pending')) return <LoadingComponent message="Loading products..." />;

  return (
    <>
      <Products products={catalog} />
    </>
  );
};

export default Catalog;
