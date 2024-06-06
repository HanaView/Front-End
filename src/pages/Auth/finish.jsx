import React from "react";
import "./finish.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/Button";

function Finish() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  return (
    <>
      <div className="homeLogo"></div>
      <div className="finishPage">
        <div className="finishCenter">
          <div className="title">본인인증이 완료되었습니다.</div>
          <div className="title">페이지를 닫으셔도 좋습니다.</div>
          <Button
            shape="rect"
            onClick={() => navigate(`/auth/customer?key=${key}`)}
          >
           이동
          </Button>
          <div className="hanaCharacter"></div>
        </div>
      </div>
    </>
  );
}

export default Finish;
