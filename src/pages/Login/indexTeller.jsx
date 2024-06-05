import React, { useState } from "react";
import "./indexTeller.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function LoginTeller() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [randomKey, setRandomKey] = useState("");
  const navigate = useNavigate();

  const isFormValid = name.trim() !== "" && password.trim() !== "";

  // randomKey가 업데이트되면 navigate 호출
  // useEffect(() => {
  //   if (randomKey) {
  //     navigate(`/camera?key=${randomKey}`);
  //   }
  // }, [randomKey, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 보내고자 하는 데이터
    const authData = {
      loginId: name,
      password: password
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:80/api/auth/consultant/login",
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

        navigate("/consulting/teller/loading");        
      } else {
        // Handle authentication failure
        alert(response.data.errorCode.message);
        console.error("Authentication failed:", response.data.errorCode.message);
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
              />
            </label>
            <label>
              <div className="labelText">비밀번호</div>
              <input
                className="inputForm"
                type="text"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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