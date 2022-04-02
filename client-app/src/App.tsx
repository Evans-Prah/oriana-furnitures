import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import ProductDetails from "./components/Catalog/ProductDetails";
import Navbar from "./components/Layout/Navbar";
import About from "./features/About/About";
import Catalog from "./features/Catalog/Catalog";
import Home from "./features/Home/Home";
import "./scss/App.scss";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:productUuid" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;
