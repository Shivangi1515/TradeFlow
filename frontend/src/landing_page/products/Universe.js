import React from "react";

function Universe() {
  const logoStyle = {
    width: "180px",
    height: "60px",
    objectFit: "contain",
  };

  return (
    <div className="container py-5">
      <div className="row text-center mb-5">
        <h1 className="mb-3">The TradeFlow Universe</h1>
        <p className="text-muted">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>
      </div>

      <div className="row text-center">

        {/* Smallcase */}
        <div className="col-lg-4 col-md-6 col-12 mb-5">
          <img
            src="media/images/smallcaseLogo.png"
            alt="Smallcase"
            className="img-fluid"
            style={logoStyle}
          />
          <p className="text-muted mt-3">
            Thematic investment platform
          </p>
        </div>

        {/* Streak */}
        <div className="col-lg-4 col-md-6 col-12 mb-5">
          <img
            src="media/images/streakLogo.png"
            alt="Streak"
            className="img-fluid"
            style={logoStyle}
          />
          <p className="text-muted mt-3">
            Algo & strategy platform
          </p>
        </div>

        {/* Sensibull */}
        <div className="col-lg-4 col-md-6 col-12 mb-5">
          <img
            src="media/images/sensibullLogo.svg"
            alt="Sensibull"
            className="img-fluid"
            style={logoStyle}
          />
          <p className="text-muted mt-3">
            Options trading platform
          </p>
        </div>

        {/* TradeFlow FundHouse */}
        <div className="col-lg-4 col-md-6 col-12 mb-5">
          <img
            src="media/images/TradeFlow Fundhouse.png"
            alt="TradeFlow FundHouse"
            className="img-fluid"
            style={logoStyle}
          />
          <p className="text-muted mt-3">
            Index funds & investment platform
          </p>
        </div>

        {/* GoldenPi */}
        <div className="col-lg-4 col-md-6 col-12 mb-5">
          <img
            src="media/images/goldenpiLogo.png"
            alt="GoldenPi"
            className="img-fluid"
            style={logoStyle}
          />
          <p className="text-muted mt-3">
            Fixed income investment platform
          </p>
        </div>

        {/* Ditto */}
        <div className="col-lg-4 col-md-6 col-12 mb-5">
          <img
            src="media/images/dittoLogo.png"
            alt="Ditto"
            className="img-fluid"
            style={logoStyle}
          />
          <p className="text-muted mt-3">
            Insurance advisory platform
          </p>
        </div>
        <button className='p-2 btn btn-primary fs-5 mb-5' style={{width:"20%",margin:"0 auto"}}>Signup Now</button>

      </div>
    </div>
  );
}

export default Universe;