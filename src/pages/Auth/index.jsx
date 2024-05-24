import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "./camera";
import "./index.scss";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { capturedImageAtom } from "@/stores";

function Auth() {
  const [capturedImage, setCapturedImage] = useAtom(capturedImageAtom);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [registNumber, setRegistNumber] = useState("");
  const [address, setAddress] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const onClickCancel = () =>{
    // @ts-ignore
    setCapturedImage(null);
    navigate("/camera");
  }

  return (
    <div className="Auth">
      <div className="container">
        <h2 className="text-container">신분증 인증</h2>
        <div className="id-card">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" />
          ) : (
            <img src="/path/to/your/id-card-image.png" alt="ID Card" />
          )}
        </div>
        {/* <Camera setCapturedImage={setCapturedImage} /> */}
        <p className="text-container">
          신분증 정보를 확인해주세요. <br />
          <br />
          <br />
          <br />
          신분증 정보를 확인하고 지금 수동으로 작성해주세요. <br />
          실제 정보와 다른 경우 등록이 불가합니다.
        </p>
        <form>
          <label>
            이름
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            주민등록번호
            <input
              type="text"
              value={registNumber}
              onChange={(e) => setRegistNumber(e.target.value)}
            />
          </label>
          <label>
            주소
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label>
            발급일자
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </label>

          <div className="button-container">
            <Button shape="rect" onClick={""}>
              확인
            </Button>
            <Button shape="rect" onClick={onClickCancel}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
