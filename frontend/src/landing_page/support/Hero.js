import React from "react";

function Hero() {
  return (
    <section id="supportHero">
      <div className="container py-5">
        
        {/* Top row */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h5 className="m-0">Support Portal</h5>
          <a href="" className="track-ticket">Track Tickets</a>
        </div>

        {/* Main content row */}
        <div className="row">
          {/* Left section */}
          <div className="col-lg-7 pe-lg-5 mb-4 mb-lg-0">
            <h2 className="support-heading mb-4">
              Search for an answer or browse help topics to create a ticket
            </h2>

            <input
              type="text"
              className="support-input mb-4"
              placeholder="Eg: how do I activate F&O, why is my order getting rejected..."
            />

            <div className="support-links">
              <a href="">Track account opening</a>
              <a href="">Track segment activation</a>
              <a href="">Intraday margins</a>
              <a href="">Kite user manual</a>
            </div>
          </div>

          {/* Right section */}
          <div className="col-lg-5 ps-lg-4">
            <h4 className="mb-3">Featured</h4>
            <ol className="featured-list">
              <li>
                <a href="">Current Takeovers and Delisting - January 2024</a>
              </li>
              <li>
                <a href="">Latest Intraday leverages - MIS & CO</a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;