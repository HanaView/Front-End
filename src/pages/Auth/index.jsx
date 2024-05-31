import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "./camera";
import "./index.scss";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { capturedImageAtom, globalModalAtom } from "@/stores";
import axios from "axios";
import onRequest from "@/utils/axios";

function Auth() {
  const [capturedImage, setCapturedImage] = useAtom(capturedImageAtom);
  const [modalData, setModalData] = useAtom(globalModalAtom); // 모달
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [registNumber, setRegistNumber] = useState("");
  const [address, setAddress] = useState("");
  const [issueDate, setIssueDate] = useState("");  

  const ocrData = JSON.parse(localStorage.getItem("ocrData"));
  console.log("-------------ocrData를 뽑아오자---------------");
  console.log(ocrData[1].data[1]);
  const user = ocrData[1].data[1].user[1];
  console.log("-------------redis에 저장된 user정보를 뽑아오자---------------");
  console.log(ocrData[1].data[1].user[1]);
  const key = ocrData[1].data[1].key;
  console.log("-------------key값을 뽑아오자---------------");
  console.log(ocrData[1].data[1].key);

  useEffect(() => {
    if (ocrData) {
      setName(ocrData[1].data[1].username);
      setRegistNumber(ocrData[1].data[1].usernum);
      setAddress(ocrData[1].data[1].useraddress);
      setIssueDate(ocrData[1].data[1].userdate);
    }
  }, [ocrData]);

  // redis에 저장할 내용들
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(key)
    if (name === user.name && registNumber === user.socialNumber) {
      // 본인인증이 완료되었을때
      console.log("본인인증이 완료되었습니다!!!");
  
      try {
        const response = await axios.post(
          "http://172.16.20.211:80/api/login/authComplete",
          null, // 요청 본문이 없는 경우 null을 사용
          { params: { key: key } } // 쿼리 파라미터로 key를 전달
        );

        console.log("--------------------------------------");
        console.log(response.data);
  
        if (response.data[1].result == "success") {
          setModalData((prevState) => ({
            ...prevState,
            isOpen: true,
            content: "본인인증이 완료되었습니다",
            confirmButtonText: "확인",
            onClickConfirm: () => navigate("/authfinish")
          }));
        } else {
          // Handle authentication failure
          console.error("Authentication failed:", response.data.message);
          setModalData((prevState) => ({
            ...prevState,
            isOpen: true,
            content: `인증 실패: ${response.data.message}`,
            confirmButtonText: "확인"
          }));
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response error:", error.response.data);
          setModalData((prevState) => ({
            ...prevState,
            isOpen: true,
            content: `서버 응답 에러: ${error.response.data.message || error.response.status}`,
            confirmButtonText: "확인"
          }));
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response error:", error.request);
          setModalData((prevState) => ({
            ...prevState,
            isOpen: true,
            content: "서버로부터 응답이 없습니다. 네트워크 상태를 확인해주세요.",
            confirmButtonText: "확인"
          }));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Axios error:", error.message);
          setModalData((prevState) => ({
            ...prevState,
            isOpen: true,
            content: `요청 설정 에러: ${error.message}`,
            confirmButtonText: "확인"
          }));
        }
      }
    } else {
      // 본인인증이 틀렸을때
      console.log("다시 입력해주세요!!!");
      setModalData((prevState) => ({
        ...prevState,
        isOpen: true,
        content: "다시 입력해주세요",
        confirmButtonText: "확인"
      }));
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
            <Button type="submit" shape="rect" onClick={handleSubmit}>
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
