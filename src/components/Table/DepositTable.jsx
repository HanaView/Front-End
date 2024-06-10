import React from "react";
import "./style.scss"
import Button from "../Button";

function DepositTable({ products, onProductClick }) {
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
          <div className="cell">분류</div>
          <div className="cell">가입 대상</div>
          <div className="cell smallCell">금리(6개월)</div>
          <div className="cell smallCell">금리(12개월)</div>
          <div className="cell">한도</div>
          <div className="cell">가입</div>
        </div>
        {products.map((product, index) => (
          <div className="row depositTable" key={index}>
            <div className="cell" data-title="상품명">
              {product.name}
            </div>
            <div className="cell" data-title="분류">
              {product.depositCategoryId == 1 ? "입출금자유예금" : "정기예금"}
            </div>
            <div className="cell" data-title="가입 대상">
              {product.target ?? "누구나"}
            </div>
            <div className="cell" data-title="금리(6개월)">
              {product.depositRates[0].rate}
            </div>
            <div className="cell" data-title="금리(12개월)">
              {product.depositRates[1].rate}
            </div>
            <div className="cell" data-title="한도">
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

export default DepositTable;
