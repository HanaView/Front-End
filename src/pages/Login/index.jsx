import React, { useState } from "react";
import "./style.scss";
import Button from "@/components/Button";

function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const isFormValid = name.trim() !== "" && phone.trim() !== "";

  return (
    <>
      <div className="loginContainer">
        <div className="logoContainer">
          <div className="hanaViewLogo"></div>
          <div className="hanaViewText"></div>
        </div>

        <div className="loginForm">
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
                placeholder="전화번호를 입력해주세요"
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
                onClick={() => console.log("김서윤 바보")}
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
        </div>
      </div>
    </>
  );
}

export default Login;
