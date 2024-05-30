import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "./camera";
import "./index.scss";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { capturedImageAtom, globalModalAtom } from "@/stores";
import axios from "axios";

function Auth() {
  const [capturedImage, setCapturedImage] = useAtom(capturedImageAtom);
  const [modalData, setModalData] = useAtom(globalModalAtom); // 모달
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [registNumber, setRegistNumber] = useState("");
  const [address, setAddress] = useState("");
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    const ocrData = JSON.parse(localStorage.getItem("ocrData"));
    if (ocrData) {
      // console.log("??",ocrData);
      setName(ocrData.data.username);
      setRegistNumber(ocrData.data.usernum);
      setAddress(ocrData.data.useraddress);
      setIssueDate(ocrData.data.userdate);
    }
  }, []);

  // redis에 저장할 내용들
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/getUserData", {
        params: { userId: "yourUserId" }
      }); // Adjust userId as needed
      const userData = response.data;

      if (name === userData.name && registNumber === userData.registNumber) {
        // 본인인증이 완료되었을때
        setModalData((prevState) => ({
          ...prevState,
          isOpen: true,
          content: "본인인증이 완료되었습니다"
        }));
      } else {
        // 본인인증이 틀렸을때
        setModalData((prevState) => ({
          ...prevState,
          isOpen: true,
          content: "다시 입력해주세요"
        }));
      }
    } catch (error) {
      console.error("There was an error fetching the user data!", error);
    }
  };

  const onClickCancel = () => {
    // @ts-ignore
    setCapturedImage(null);
    setName("");
    setRegistNumber("");
    setAddress("");
    setIssueDate("");
    navigate("/camera");
  };

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
        <p className="text-container">
          신분증 정보를 확인해주세요. <br />
          <br />
          <br />
          <br />
          신분증 정보를 확인하고 지금 수동으로 작성해주세요. <br />
          실제 정보와 다른 경우 등록이 불가합니다.
        </p>
        <form onSubmit={handleSubmit}>
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
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </label>

          <div className="button-container">
            <Button type="submit" shape="rect" onClick={""}>
              확인
            </Button>
            <Button type="button" shape="rect" onClick={onClickCancel}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
