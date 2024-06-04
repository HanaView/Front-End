import React from "react";
import "./explaining_customer.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

function ExplainingCustomer() {
  const navigate = useNavigate();

  return (
    <>
      <div className="ExplainingCustomerContainer">
        <div className="title">원하시는 업무를 선택해주세요</div>
        <div className="buttonLine">
          <Button className="button" shape="rect" onClick={() => navigate("")}>
            예/적금
            <br />
            업무
          </Button>
          <Button className="button" shape="rect" onClick={() => navigate("")}>
            카드
            <br />
            업무
          </Button>
          <Button className="button" shape="rect" onClick={() => navigate("")}>
            대출
            <br />
            업무
          </Button>
          <Button className="button" shape="rect" onClick={() => navigate("")}>
            전자금융
            <br />
            업무
          </Button>
        </div>
        <div className="contentContainer">
          
        </div>
      </div>
    </>
  );
}
export default ExplainingCustomer;
