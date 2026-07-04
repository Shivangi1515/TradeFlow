import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container py-5">
      <div className="row align-items-center">

        {/* Left Side Image */}
        <div className="col-lg-6 text-center">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
          />
        </div>

        {/* Right Side Content */}
        <div className="col-lg-6 mt-5 mt-lg-0">

          <h1>{productName}</h1>

          <p className="text-muted mt-3">
            {productDescription}
          </p>

          <div className="mt-4">
            <a
              href={tryDemo}
              className="text-decoration-none me-5"
            >
              Try Demo →
            </a>

            <a
              href={learnMore}
              className="text-decoration-none"
            >
              Learn More →
            </a>
          </div>

          <div className="mt-4">
            <a href={googlePlay}>
              <img
                src="media/images/googlePlayBadge.svg"
                alt="Google Play"
                className="me-3"
              />
            </a>

            <a href={appStore}>
              <img
                src="media/images/appStoreBadge.svg"
                alt="App Store"
              />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

export default LeftSection;