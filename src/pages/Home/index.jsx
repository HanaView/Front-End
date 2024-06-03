import React from "react";
import "./style.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { UserTypes } from "@/stores/type";
import useMain from "../Main/useMain";

function Home() {
  const navigate = useNavigate();
  const { onChangeUserType } = useMain();

  return (
    <>
      <div className="homeLogo"></div>
      <div className="homePage">
        <div></div>
        <div className="homeCenter">
          <div className="title">비대면 창구 서비스</div>
          <div>
            <Button
              className="button"
              shape="rect"
              onClick={() => {
                console.log("고객용");
                navigate("/login/customer");
                onChangeUserType(UserTypes.CUSTOMER)
              }}
            >
              고객용
            </Button>
            <Button
              className="button"
              shape="rect"
              onClick={() => {
                console.log("텔러용");
                navigate("/login/teller");
                onChangeUserType(UserTypes.TELLER)
              }}
            >
              텔러용
            </Button>
          </div>
          <div className="hanaCharacter"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
