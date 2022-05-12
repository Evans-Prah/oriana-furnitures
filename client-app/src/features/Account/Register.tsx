import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../api/agent";
import { validateEmail } from "../../util/util";
import "./Account.scss";

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const inputChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const registerSubmitHandler = (event: any) => {
    event.preventDefault();
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let email = (document.getElementById("email") as HTMLInputElement).value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    let confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;
    let phoneNumber = (
      document.getElementById("phoneNumber") as HTMLInputElement
    ).value;
    if (username === null || username === "")
      return toast.error("Please enter a username");
    if (password === null || password === "")
      return toast.error("Please enter a password");
    if (phoneNumber === null || phoneNumber === "")
      return toast.error("Please, enter phone number");
    if (email === null || email === "")
      return toast.error("Please, enter email address");
    if (!validateEmail(email))
      return toast.error("Enter a valid email address");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match, try again");

    if (password.length <= 5)
      return toast.error("Password should be at least 6 characters long");

    agent.Account.register(values)
      .then((res) => {
        if (res?.success === true) {
          toast.success('Registration successful - you can login now!')
          setTimeout(() => {
            navigate("/auth/login");
          }, 3000);
        }
        return false;
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="account-section">
      <div className="account">
        <div className="account__form">
          <form className="form" onSubmit={registerSubmitHandler}>
            <div className="heading-container">
              <h2 className="heading-secondary">Create Account</h2>
            </div>
            <div className="form__group">
              <input
                type="text"
                className="form__input"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={inputChangeHandler}
                id="username"
              />
              <label htmlFor="username" className="form__label">
                Username
              </label>
            </div>
            <div className="form__group">
              <input
                type="email"
                className="form__input"
                placeholder="Email address"
                name="email"
                value={values.email}
                onChange={inputChangeHandler}
                id="email"
              />
              <label htmlFor="email" className="form__label">
                Email address
              </label>
            </div>
            <div className="form__group">
              <input
                type="tel"
                className="form__input"
                placeholder="Phone number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={inputChangeHandler}
                id="phoneNumber"
              />
              <label htmlFor="phoneNumber" className="form__label">
                Phone Number
              </label>
            </div>
            <div className="form__group">
              <input
                type="password"
                className="form__input"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={inputChangeHandler}
                id="password"
              />
              <label htmlFor="password" className="form__label">
                Password
              </label>
            </div>
            <div className="form__group">
              <input
                type="password"
                className="form__input"
                placeholder="Password"
                name="confirmPassword"
                onChange={(e) => e.target.value}
                id="confirmPassword"
              />
              <label htmlFor="confirmPassword" className="form__label">
                Confirm Password
              </label>
            </div>

            <div className="form__group">
              <button type="submit" className="btn btn--account">
                Register
              </button>
            </div>
            <div>
              <Link to="/auth/login" className="existing-account">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
