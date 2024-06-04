import React from "react";
import "./loading_customer.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

function LoadingCustomer() {
  const navigate = useNavigate();

  return (
    <>
      <div className="LoadingCustomerContainer">
        <div className="title">원하시는 업무를 선택해주세요</div>
        <div className="dummy"></div>
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
        </div>
        <div className="buttonLine">
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
        <div className="dummy"></div>
        <div className="dummy"></div>

        <div className="title">각종 발급 업무는 근처 은행에서 진행해주세요</div>        
        <Button       
          style={{ width: "40%", height:"70px", fontSize:"25px" }}
          shape="rect"
          onClick={() => navigate("")}
        >
          가까운 지점 찾기
        </Button>
      </div>
    </>
  );
}
export default LoadingCustomer;
