import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "./camera";
import "./index.scss";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { capturedImageAtom } from "@/stores";
import axios from "axios";

function Auth() {
  const [capturedImage, setCapturedImage] = useAtom(capturedImageAtom);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [registNumber, setRegistNumber] = useState("");
  const [address, setAddress] = useState("");
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    // Fetch the OCR data from the backend
    // axios
    //   .get("http://localhost:80/api/login/ocr") // Adjust the URL as needed
    //   .then((response) => {
    //     const data = response.data;
    //     setName(data.username);
    //     setRegistNumber(data.usernum);
    //     setAddress(data.useraddress);
    //     setIssueDate(data.userdate);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the OCR data!", error);
    //   });

    const ocrData = JSON.parse(localStorage.getItem("ocrData"));
    if (ocrData) {
      console.log("??",ocrData);
      setName(ocrData.data.username);
      setRegistNumber(ocrData.data.usernum);
      setAddress(ocrData.data.useraddress);
      setIssueDate(ocrData.data.userdate);
    }
  }, []);

  // db에 저장할 내용들
  const handleSubmit = (e) => {
    // e.preventDefault();
    // // Save the form data to the backend
    // const formData = {
    //   name,
    //   registNumber,
    //   address,
    //   issueDate
    // };
    // axios
    //   .post("/saveData", formData) // Adjust the URL as needed
    //   .then((response) => {
    //     alert("Data saved successfully!");
    //   })
    //   .catch((error) => {
    //     console.error("There was an error saving the data!", error);
    //   });
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
        {/* <Camera setCapturedImage={setCapturedImage} /> */}
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
