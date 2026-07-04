import React from 'react';

function RightSection(
  {
    imageURL,
    productName,
    productDescription,
    learnMore
  }
) {
  return (
    <div className="container py-5">
      <div className="row align-items-center">

        {/* Left Side Image */}


        {/* Right Side Content */}
        <div className="col-lg-6 mt-5 mt-lg-0">

          <h1>{productName}</h1>

          <p className="text-muted mt-3">
            {productDescription}
          </p>

          <div className="mt-4">

            <a
              href={learnMore}
              className="text-decoration-none"
            >
              Learn More →
            </a>
          </div>



        </div>
        <div className="col-lg-6 text-center">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
          />
        </div>

      </div>
    </div>
  );
}

export default RightSection;