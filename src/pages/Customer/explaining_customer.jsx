import React, { useState } from "react";
import "./explaining_customer.scss";
import Button from "@/components/Button";
import Products from "./Products";

function ExplainingCustomer() {
  const ProductType = {
    Deposit: 1,
    Card: 2,
    Loan: 3,
    Service: 4
  };

  const [productBtn, setProductBtn] = useState(ProductType.Deposit);

  return (
    <>
      <div className="ExplainingCustomerContainer">
        <div className="title">원하시는 상품을 선택해주세요</div>
        <div className="buttonLine">
          <Button
            className="button"
            shape="rect"
            onClick={() => setProductBtn(ProductType.Deposit)}
          >
            예/적금
            <br />
            상품
          </Button>
          <Button
            className="button"
            shape="rect"
            onClick={() => setProductBtn(ProductType.Card)}
          >
            카드
            <br />
            상품
          </Button>
          <Button
            className="button"
            shape="rect"
            onClick={() => setProductBtn(ProductType.Loan)}
          >
            대출
            <br />
            상품
          </Button>
          <Button
            className="button"
            shape="rect"
            onClick={() => setProductBtn(ProductType.Service)}
          >
            전자금융
            <br />
            상품
          </Button>
        </div>
        <Products type={productBtn} />
      </div>
    </>
  );
}
export default ExplainingCustomer;
