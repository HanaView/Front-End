import React, { useState, useEffect } from "react";
import "./auth_complete.scss";
import Button from "@/components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function AuthCustomer() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  const checkToken = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(       
        "https://hanaview.shop/api/login/validate?key=" + key
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

        localStorage.setItem("key", key);

        navigate(`/consulting/customer/loading?key=${key}`);
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
            <div className="content">&nbsp;이내에</div>
          </div>
          <br />
          <div className="content">인증해주세요</div>
          <div className="dummy"></div>
          <div>
            <Button
              size="large"
              shape="rect"
              onClick={checkToken}
              // onClick={() => navigate("/consulting/customer/loading")}
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
