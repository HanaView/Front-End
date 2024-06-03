import React from "react";
import "./style.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="homeLogo"></div>
      <div className="homePage">
        <div></div>
        <div className="homeCenter">
          <div className="title">비대면 창구 서비스</div>
          <div>
            <Button
              size="large"
              shape="rect"
              onClick={() => {
                console.log("김서윤 바보");
                navigate("/login/customer");
              }}
            >
              시작하기
            </Button>
          </div>
          <div className="hanaCharacter"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
