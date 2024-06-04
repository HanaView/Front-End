import React, { useState } from "react";
import "./auth_complete.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function AuthCustomer() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(600); // 10분을 초 단위로 설정 (10분 * 60초)

  useEffect(() => {
    if (timeLeft === 0) {
      navigate("/login/customer");
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes} : ${secs}`;
  };

  return (
    <>
      <div className="loginContainer">
        <div className="logoContainer">
          <div className="hanaViewLogo"></div>
          <div className="hanaViewText"></div>
        </div>

        <div className="loginForm">
          <div className="dummy"></div>
          <div className="timer">
            <div className="clock">{formatTime(timeLeft)}</div>
            <div className="content">이내에</div>
          </div>
          <br />
          <div className="content">인증해주세요</div>
          <div className="dummy"></div>
          <div>
            <Button
              size="large"
              shape="rect"
              onClick={() => navigate("/consulting/customer/loading")}
            >
              본인인증 완료
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthCustomer;
