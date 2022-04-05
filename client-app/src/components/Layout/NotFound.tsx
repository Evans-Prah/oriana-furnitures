import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="container">
      <img src="../images/lego.png" alt="" className="container-img" />
      <div className="container-details">
        <h1 className="container-details-title">You there, Halt! Nice Try</h1>
        <p className="container-details-info">
          You are seeing this because you aren't allowed access to the page you
          requested, or that page does not exist. There is a good chance you are
          either signed out(login and try this page again) or you are trying to
          access a page that does not exist
        </p>
      </div>
    </div>
  );
};

export default NotFound;
