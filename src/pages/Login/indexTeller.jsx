import React, { useState, useEffect } from "react";
import "./indexTeller.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginTeller() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isFormValid = name.trim() !== "" && password.trim() !== "";
  const redisKey = localStorage.getItem("key");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 보내고자 하는 데이터
    const authData = {
      loginId: name,
      password: password
    };

    try {
      const response = await axios.post(
        "https://hanaview.shop/api/auth/consultant/login",
        authData
      );

      console.log("------------------------------");
      console.log(response.data);

      if (response.data.state == 200) {
        console.log("--------accessToken----------");
        console.log(response.data.data.accessToken);
        console.log("--------refreshToken----------");
        console.log(response.data.data.refreshToken);
        console.log("--------refreshTokenExpirationTime----------");
        console.log(response.data.data.refreshTokenExpirationTime);

        sessionStorage.setItem("ACCESS_TOKEN", response.data.data.accessToken);
        sessionStorage.setItem(
          "REFRESH_TOKEN",
          response.data.data.refreshToken
        );

        navigate("/consulting/teller/loading?key"+redisKey);
      } else {
        // Handle authentication failure
        alert(response.data.errorCode.message);
        console.error(
          "Authentication failed:",
          response.data.errorCode.message
        );
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Axios error:", error.message);
      }
    }
  };
  // enter 키로 로그인
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isFormValid) {
      handleSubmit(e);
    }
  };
  return (
    <>
      <div className="loginContainer">
        <div className="logoContainer">
          <div className="hanaViewLogo"></div>
          <div className="hanaViewText"></div>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="inputPos">
            <label>
              <div className="labelText">아이디</div>
              <input
                className="inputForm"
                type="text"
                placeholder="아이디를 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>
            <label>
              <div className="labelText">비밀번호</div>
              <input
                className="inputForm"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>
          </div>
          <div>
            {isFormValid ? (
              <Button
                size="large"
                shape="rect"
                onClick={handleSubmit}
                style={{ cursor: "pointer" }}
              >
                로그인
              </Button>
            ) : (
              <Button
                size="large"
                shape="rect"
                disabled
                onClick={() => console.log("버튼 눌리나??")}
                style={{ backgroundColor: "#CCCCCC", cursor: "not-allowed" }}
              >
                로그인
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginTeller;
