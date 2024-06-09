import React from "react";
import "./style.scss";
import Button from "../Button";

function SavingTable({ products, onProductClick }) {
  console.log("SavingTable", products);
  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }
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
              {product.target ?? "누구나"}
            </div>
            <div className="cell" data-title="금리(6개월)">
              {product.savingRates[0].rate == 0
                ? "-"
                : product.savingRates[0].rate}
            </div>
            <div className="cell" data-title="금리(12개월)">
              {product.savingRates[1].rate}
            </div>
            <div className="cell" data-title="금리(12개월)">
              {product.maxJoinAmount
                ? product.maxJoinAmount.toLocaleString()
                : "제한없음"}
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

export default SavingTable;
