/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import "./style.scss";
import Button from "../Button";
import pdfIcon from "../../assets/images/pdfIcon.png"

function CardTable({ products, onProductClick }) {
  console.log("CardTable", products);

  const handleProduct = (product) => {
    onProductClick(product);
  };
  if (!Array.isArray(products)) {
    return <div>No products available</div>;
  }
  return (
    <div className="wrapper">
      <div className="table">
        <div className="row header green">
          <div className="cell">카드상품명</div>
          <div className="cell">혜택1</div>
          <div className="cell">혜택2</div>
          <div className="cell">연회비</div>
          <div className="cell">정보</div>
          <div className="cell">가입</div>
        </div>
        {products.map((product, index) => (
          <div className="row" key={index}>
            <div className="cell" data-title="상품명">
              {product.name}
            </div>
            <div className="cell" data-title="혜택1">
              {product.cardBenefits[0]?.content ?? "-"}
            </div>
            <div className="cell" data-title="혜택2">
              {product.cardBenefits[1]?.content ?? "-"}
            </div>
            <div className="cell" data-title="연회비">
              {product.annualFee == 0 ? "-" : product.annualFee}
            </div>
            <div className="cell" data-title="정보">
              <a target="_blank" href={product.link ?? "#"} rel="noreferrer">
                <img
                  src={pdfIcon}
                  alt="PDF"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
            </div>
            <div className="cell" data-title="가입하기">
              <Button onClick={() => handleProduct(product)}>가입</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardTable;
