import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../api/agent";
import { loginUser } from "../../store/accountSlice";
import { useAppDispatch } from "../../store/configureStore";
import "./Account.scss";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const inputChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setValues({...values, [name]: value});
  };

  const loginSubmitHandler = (event: any) => {
    event.preventDefault();
    let username = (document.getElementById('username') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;
    if(username === null || username === '') {
      toast.error("Please enter a username");
    }
    if(password === null || password === '') {
      toast.error("Please enter a password");
    }

    dispatch(loginUser(values));
    if(!loginUser.rejected) return false;
    setTimeout(() => {
      navigate("/catalog");
    }, 3000);


    // agent.Account.login(values).then((res) => {
    //   if(res.token) {
    //      navigate('/catalog');
    //   }
    //   return false;
    // }).catch((err) => console.log(err));
  };

  return (
    <div className="account-section">
      <div className="account">
        <div className="account__form">
          <form className="form" onSubmit={loginSubmitHandler}>
            <div className="heading-container">
              <h2 className="heading-secondary">Login</h2>
            </div>
            <div className="form__group">
              <input
                type="text"
                className="form__input"
                name="username"
                placeholder="Username"
                id="username"
                onChange={inputChangeHandler}
                value={values.username}
              />
              <label htmlFor="username" className="form__label">
                Username
              </label>
            </div>

            <div className="form__group">
              <input
                type="password"
                className="form__input"
                name="password"
                placeholder="Password"
                id="password"
                onChange={inputChangeHandler}
                value={values.password}
              />
              <label htmlFor="password" className="form__label">
                Password
              </label>
            </div>

            <div className="form__group">
              <button type="submit" className="btn btn--account">
                Login
              </button>
            </div>
            <div>
              <Link to="/auth/register" className="no-account">
                Don't have an account? Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
