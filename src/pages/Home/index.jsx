import React from "react";
import "./style.scss";
import Button from "@/components/Button";

function Home() {
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
              onClick={() => console.log("이고은")}
            >
              시작하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
