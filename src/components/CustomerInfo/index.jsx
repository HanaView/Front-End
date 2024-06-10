// src/components/CustomerInfo/index.jsx
import React from "react";
import { useAtom } from "jotai";
import "./style.scss";
import { customerInfoModalAtom } from "@/stores";
import CustomerInfoModal from "@/pages/_shared/Modal/CustomerInfoModal";

const CustomerInfo = ({ name, phoneNumber, idNumber, image }) => {
  const [customerInfoModalData, setCustomerInfoModalData] = useAtom(
    customerInfoModalAtom
  ); // jotai를 사용한 상태 관리

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, ""); // 모든 숫자가 아닌 문자를 제거
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/); // 3-3-4 형식에 맞게 변경
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return null;
  };

  const formatIdNumber = (idNumber) => {
    const cleaned = idNumber.replace(/\D/g, ""); // 모든 숫자가 아닌 문자를 제거
    const match = cleaned.match(/^(\d{6})(\d{6})$/); // 6-7 형식에 맞게 변경
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return null;
  };

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  const formattedIdNumber = formatIdNumber(idNumber);

  const onClickCustomerInfo = () => {
    setCustomerInfoModalData({
      isOpen: true,
      children: null,
      content: (
        <div id="modalDiv">
          <div id="modalContent">
            <h1 id="customerName">{name} 님</h1>
            <div id="idImgContainer">
              <img src={`data:image/jpeg;base64,${image}`} alt="Captured" />
            </div>
            <p id="modalInfo">
              휴대폰 번호: {formattedPhoneNumber} <br />
              주민등록번호: {formattedIdNumber}
            </p>
          </div>
        </div>
      ),
      confirmButtonText: "닫기",
      onClickConfirm: () => {
        setCustomerInfoModalData({
          isOpen: false,
          children: null,
          content: null,
          confirmButtonText: "",
          onClickConfirm: null
        });
      }
    });
  };

  return (
    <div className="customerInfo" onClick={onClickCustomerInfo}>
      <h2>{name} 님</h2>
      <p>
        휴대폰 번호: <br />
        {formattedPhoneNumber}
      </p>
      <p>
        주민등록번호: <br />
        {formattedIdNumber}
      </p>
      <div id="idContainer">
        {image ? (
          <img src={`data:image/jpeg;base64,${image}`} alt="Captured" />
        ) : (
          <img src="/path/to/your/id-card-image.png" alt="ID Card" />
        )}
      </div>
      <CustomerInfoModal />
    </div>
  );
};

export default CustomerInfo;
