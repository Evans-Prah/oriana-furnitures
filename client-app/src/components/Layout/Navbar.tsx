import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useStoreContext } from "../../context/StoreContext";
import "./Navbar.scss";

export default function Navbar() {
  const {basket} = useStoreContext();
  const itemCount= basket?.data?.items?.reduce((sum, item) => sum + item.quantity, 0);
  console.log(itemCount);


  let activeStyle = {
    color: "#fff",
  };

  return (
    <nav className="navbar">
      <div className="logo">Oriana Furniture</div>
      <ul className="nav-links">
        <input type="checkbox" id="checkbox_toggle" />
        <label htmlFor="checkbox_toggle" className="hamburger">
          &#9776;
        </label>
        <div className="menu">
          <li>
            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? activeStyle : undefined)!}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              style={({ isActive }) => (isActive ? activeStyle : undefined)!}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/catalog"
              style={({ isActive }) => (isActive ? activeStyle : undefined)!}
            >
              Catalog
            </NavLink>
          </li>
          <li className="sub-menu">
            <a href="/#">User</a>
            <ul className="dropdown">
              <li>
                <a href="/#">Orders</a>
              </li>
              <li>
                <a href="/#">Logout</a>
              </li>
            </ul>
          </li>

          <li>
            <a href="/#">LogIn</a>
          </li>
          <li>
            <a href="/#">Register</a>
          </li>
          <li>
            <Link to="/basket" className="shopping-cart">
              <svg className="shopping-cart-icon">
                <use xlinkHref="./images/sprite.svg#icon-shopping-cart"></use>
              </svg>
              <span className="cart-badge">{itemCount}</span>
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
