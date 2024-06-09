import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Button from "../../../../components/Button";
import "./style.scss";
import { agreementModalAtom, socketAtom, messageModalAtom } from "@/stores";
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
  const [signalingSocket] = useAtom(socketAtom);
  const [messageModalData, setMessageModalData] = useAtom(messageModalAtom); // jotai를 사용한 상태 관리

  const [agreements, setAgreements] = useState({
    basic: false,
    deposit: false,
    composite: false,
    autoTransfer: false
  });
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (agreementModalData.isOpen) {
      // Reset the agreements state and selectAll when the modal opens
      setAgreements({
        basic: false,
        deposit: false,
        composite: false,
        autoTransfer: false
      });
      setSelectAll(false);
    }
  }, [agreementModalData.isOpen]);

  // Check if all checkboxes are selected
  const isAllChecked = () => {
    return Object.values(agreements).every(value => value);
  };

  const handleCheckboxChange = (e) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked
    });
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setAgreements({
      basic: checked,
      deposit: checked,
      composite: checked,
      autoTransfer: checked
    });
  };

  useEffect(() => {
    setSelectAll(isAllChecked());
  }, [agreements]);

  const onClickConfirmButton = () => {
    // TODO 서버가 null 임 ㅠㅠ
    console.log("@@@ signalingSocket", signalingSocket);

    
    if (isAllChecked()) {
      agreementModalData.onClickConfirm(agreements);
      setAgreementModalData((prevData) => ({
        ...prevData,
        isOpen: false
      }));

      // Notify the teller that all agreements are completed
      if (signalingSocket && signalingSocket.readyState === WebSocket.OPEN) {
        setMessageModalData({
          isOpen: true,
          children: null,
          content: (
            <div id="modalDiv">
              <div id="modalContent">
                <p id="modalInfo">동의서 작성이 완료되었습니다.</p>
              </div>
            </div>
          ),
          confirmButtonText: "확인",
          onClickConfirm: () => {
            // Close the modal
            setMessageModalData({
              isOpen: false,
              children: null,
              content: null,
              confirmButtonText: "",
              onClickConfirm: null
            });
          }
        });
        console.log("Sending agreements_completed message");

        signalingSocket.send(
          JSON.stringify({
            type: "agreements_completed"
          })
        );
      }
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
              <label>
                <input
                  type="checkbox"
                  name="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                전체 동의
              </label>
            </div>
            <div className="agreement-item">
              <p>예금거래 기본 약관</p>
              <label>
                <input
                  type="checkbox"
                  name="basic"
                  checked={agreements.basic}
                  onChange={handleCheckboxChange}
                />
                동의
              </label>
            </div>
            <div className="agreement-item">
              <p>거치식 예금 약관</p>
              <label>
                <input
                  type="checkbox"
                  name="deposit"
                  checked={agreements.deposit}
                  onChange={handleCheckboxChange}
                />
                동의
              </label>
            </div>
            <div className="agreement-item">
              <p>비거래 종합저축 특약 약관</p>
              <label>
                <input
                  type="checkbox"
                  name="composite"
                  checked={agreements.composite}
                  onChange={handleCheckboxChange}
                />
                동의
              </label>
            </div>
            <div className="agreement-item">
              <p>계좌간 자동이체 약관</p>
              <label>
                <input
                  type="checkbox"
                  name="autoTransfer"
                  checked={agreements.autoTransfer}
                  onChange={handleCheckboxChange}
                />
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
