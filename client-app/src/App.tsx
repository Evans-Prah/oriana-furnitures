import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import agent from "./api/agent";
import ProductDetails from "./components/Catalog/ProductDetails";
import LoadingComponent from "./components/Layout/LoadingComponent";
import Navbar from "./components/Layout/Navbar";
import NotFound from "./components/Layout/NotFound";
import { useStoreContext } from "./context/StoreContext";
import About from "./features/About/About";
import Basket from "./features/Basket/Basket";
import Catalog from "./features/Catalog/Catalog";
import Checkout from "./features/Checkout/Checkout";
import Home from "./features/Home/Home";
import "./scss/App.scss";
import { getCookie } from "./util/util";

function App() {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.getBasket()
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setBasket]);

  if(loading) return <LoadingComponent message='Oriana Furniture' />

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
