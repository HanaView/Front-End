import React from "react";
import Slider from "react-slick";
import classNames from "classnames";
import "./style.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Products({ type }) {
  console.log(type);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };
  return (
    <>
      <div
        className={classNames(
          "contentContainer",
          { deposit: type == 1 },
          { card: type == 2 },
          { loan: type == 3 }
        )}
      >
        <Slider {...settings}>
          <div className="item">
            <div className="first" />
          </div>
          <div className="item">
            <div className="second" />
          </div>
          <div className="item">
            <div className="third" />
          </div>
        </Slider>
      </div>
    </>
  );
}

export default Products;
