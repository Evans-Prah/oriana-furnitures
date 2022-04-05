import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./components/Catalog/ProductDetails";
import Navbar from "./components/Layout/Navbar";
import NotFound from "./components/Layout/NotFound";
import About from "./features/About/About";
import Catalog from "./features/Catalog/Catalog";
import Home from "./features/Home/Home";
import "./scss/App.scss";

function App() {

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
