import React, { useState, useEffect } from "react";
import PasswordModal from "../PasswordModal";
import Modal from "react-modal";
import Button from "../../../../components/Button";
import "./style.scss";
import { agreementModalAtom } from "@/stores";
import { useAtom } from "jotai";

const customStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    width: "406px",
    height: "400px",
    borderRadius: "22px"
  }
};

function AgreementModal() {
  const [agreementModalData, setAgreementModalData] =
    useAtom(agreementModalAtom);
  const [agreements, setAgreements] = useState({
    basic: false,
    deposit: false,
    composite: false,
    autoTransfer: false
  });

  useEffect(() => {
    if (agreementModalData.isOpen) {
      // Reset the agreements state to false when the modal opens
      setAgreements({
        basic: false,
        deposit: false,
        composite: false,
        autoTransfer: false
      });
    }
  }, [agreementModalData.isOpen]);

  // 모든 체크박스가 선택되었는지 확인하는 함수
  const isAllChecked = () => {
    return Object.values(agreements).every(value => value);
  };

  const handleCheckboxChange = (e) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked
    });
  };

  const onClickConfirmButton = () => {
    if (isAllChecked()) {
      agreementModalData.onClickConfirm(agreements);
      setAgreementModalData((prevData) => ({
        ...prevData,
        isOpen: false
      }));
    }
  };

  const closeModal = () => {
    setAgreementModalData((prevData) => ({
      ...prevData,
      isOpen: false
    }));
  };

  return (
    <Modal
      isOpen={agreementModalData.isOpen}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <div className="center">
        <Button
          color="default"
          className="right close-btn"
          onClick={closeModal}
        >
          x
        </Button>
        <div id="modalDiv" className="agreement-modal">
          <div className="header">
            <h2 id="modalInfo">상품가입 약관 동의</h2>
          </div>
          <div id="agreeModalContent" className="content">
            <div className="agreement-item">
              <p>예금거래 기본 약관</p>
              <label>
                <input type="checkbox" name="basic" onChange={handleCheckboxChange} />
                동의
              </label>
            </div>
            <div className="agreement-item">
              <p>거치식 예금 약관</p>
              <label>
                <input type="checkbox" name="deposit" onChange={handleCheckboxChange} />
                동의
              </label>
            </div>
            <div className="agreement-item">
              <p>비거래 종합저축 특약 약관</p>
              <label>
                <input type="checkbox" name="composite" onChange={handleCheckboxChange} />
                동의
              </label>
            </div>
            <div className="agreement-item">
              <p>계좌간 자동이체 약관</p>
              <label>
                <input type="checkbox" name="autoTransfer" onChange={handleCheckboxChange} />
                동의
              </label>
            </div>
          </div>
        </div>
      </div>
      <Button
        className="global-modal-button"
        shape="rect"
        onClick={onClickConfirmButton}
        disabled={!isAllChecked()}
      >
        {agreementModalData.confirmButtonText}
      </Button>
    </Modal>
  );
}
export default AgreementModal;
