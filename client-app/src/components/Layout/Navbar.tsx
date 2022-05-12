import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useStoreContext } from "../../context/StoreContext";
import { signOut } from "../../store/accountSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import "./Navbar.scss";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.account);
  const itemCount = basket?.data?.items?.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
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
          {user?.username ? (
            <li className="sub-menu">
              <a href="/#">Welcome {user?.username}</a>
              <ul className="dropdown">
                <li>
                  <a href="/#">Orders</a>
                </li>
                <li>
                  <a onClick={() => dispatch(signOut())} href="/#/">
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          ) : null}
          {user?.username ? null : (
            <>
              <li>
                <Link to="/auth/login">LogIn</Link>
              </li>
              <li>
                <Link to="/auth/register">Register</Link>
              </li>
            </>
          )}

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
