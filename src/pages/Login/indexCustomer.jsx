import React, { useState } from "react";
import "./indexCustomer.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function LoginCustomer() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redisKey, setRedisKey] = useState("");

  const navigate = useNavigate();

  const isFormValid = name.trim() !== "" && phone.trim() !== "";
 
  // randomKey가 업데이트되면 navigate 호출
  useEffect(() => {
    if (redisKey) {            
      // localStorage.setItem("key", redisKey);

      // navigate(`/camera?key=${redisKey}`);
      navigate("/auth/mobile/camera");
      // navigate(`/auth/customer?key=${randomKey}`);               
    }
  }, [redisKey, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 보내고자 하는 데이터
    const authData = {
      name: name,
      tele: phone
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:80/api/login/auth",
        authData
      );

      // console.log("---------------redis키값----------------");
      // console.log(response.data.data);
      console.log("------------------------------");
      console.log(response.data);

      if (response.data.state == 200) {       
        setRedisKey(response.data.data);
        localStorage.setItem("key", redisKey); 
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
              <div className="labelText">이름</div>
              <input
                className="inputForm"
                type="text"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              <div className="labelText">전화번호</div>
              <input
                className="inputForm"
                type="text"
                placeholder="'-'빼고 입력해주세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

export default LoginCustomer;
