import { useCallback, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./components/Catalog/ProductDetails";
import LoadingComponent from "./components/Layout/LoadingComponent";
import Navbar from "./components/Layout/Navbar";
import NotFound from "./components/Layout/NotFound";
import About from "./features/About/About";
import Login from "./features/Account/Login";
import Register from "./features/Account/Register";
import Basket from "./features/Basket/Basket";
import Catalog from "./features/Catalog/Catalog";
import Checkout from "./features/Checkout/Checkout";
import Home from "./features/Home/Home";
import "./scss/App.scss";
import { getCurrentUser } from "./store/accountSlice";
import { getBasketAsync } from "./store/basketSlice";
import { useAppDispatch } from "./store/configureStore";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initializeApp = useCallback(async () => {
    try {
      await dispatch(getCurrentUser());
      await dispatch(getBasketAsync());
    } catch (error: any) {
      toast.error("A system error occured");
    }
  }, [dispatch]);

  useEffect(() => {
    initializeApp().then(() => setLoading(false));
  }, [initializeApp]);

  if (loading) return <LoadingComponent message="Oriana Furniture" />;

  return (
    <>
      <ToastContainer
        theme="colored"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:productUuid" element={<ProductDetails />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
