import React, { useState } from "react";
import "./style.scss";
import Button from "../Button";

function DepositTable({ products, onProductClick }) {
  console.log(">>", products);

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
          <div className="cell">상품명</div>
          <div className="cell">가입 대상</div>
          <div className="cell">금리(6개월)</div>
          <div className="cell">금리(12개월)</div>
          <div className="cell">한도</div>
          <div className="cell">가입</div>
        </div>
        {products.map((product, index) => (
          <div className="row" key={index}>
            <div className="cell" data-title="상품명">
              {product.name}
            </div>
            <div className="cell" data-title="가입 대상">
              {product.target}
            </div>
            <div className="cell" data-title="금리(6개월)">
              {product.depositRates[0].rate}
            </div>
            <div className="cell" data-title="금리(12개월)">
              {product.depositRates[1].rate}
            </div>
            <div className="cell" data-title="금리(12개월)">
              {product.maxJoinAmount.toLocaleString()}
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

export default DepositTable;
