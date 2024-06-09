import React, { useState } from "react";
import PasswordModal from "../PasswordModal"
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
  const [agreementModalData, setAgreementModalData] = useAtom(agreementModalAtom);
  const [agreements, setAgreements] = useState({
    basic: false,
    deposit: false,
    composite: false,
    autoTransfer: false
  });

  const handleCheckboxChange = (e) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked
    });
  };

  const onClickConfirmButton = () => {
    agreementModalData.onClickConfirm(agreements);
  };

  return (
    <Modal
      isOpen={agreementModalData.isOpen}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <div className="agreement-modal">
        <div className="header">
          <h2>상품가입 약관 동의</h2>
          <button onClick={() => setAgreementModalData({ ...agreementModalData, isOpen: false })}>X</button>
        </div>
        <div className="content">
          <div className="agreement-item">
            <label>
              <input 
                type="checkbox" 
                name="basic" 
                checked={agreements.basic} 
                onChange={handleCheckboxChange} 
              />
              예금 거래 기본 약관
            </label>
          </div>
          <div className="agreement-item">
            <label>
              <input 
                type="checkbox" 
                name="deposit" 
                checked={agreements.deposit} 
                onChange={handleCheckboxChange} 
              />
              거치식 예금 약관
            </label>
          </div>
          <div className="agreement-item">
            <label>
              <input 
                type="checkbox" 
                name="composite" 
                checked={agreements.composite} 
                onChange={handleCheckboxChange} 
              />
              비거래 종합저축 특약
            </label>
          </div>
          <div className="agreement-item">
            <label>
              <input 
                type="checkbox" 
                name="autoTransfer" 
                checked={agreements.autoTransfer} 
                onChange={handleCheckboxChange} 
              />
              계좌간 자동이체 약관
            </label>
          </div>
        </div>
        <Button
          className="global-modal-button"
          shape="rect"
          onClick={onClickConfirmButton}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}
export default AgreementModal;
