import React, { useState } from "react";
import "./style.scss";
import Modal from "react-modal";
import Button from "../../../../components/Button";
import { passwordRequestlModalAtom } from "@/stores";
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
    height: "328px",
    borderRadius: "22px"
  }
};

function PasswordModal() {
  const [passWordmodalData, setPasswordModalData] = useAtom(
    passwordRequestlModalAtom
  );
  const [password, setPassword] = useState("");

  const onClickConfirmButton = () => {
    // 숫자 4자리 검증
    if (/^\d{4}$/.test(password)) {
      // 비밀번호 전송 로직
      passWordmodalData.onClickConfirm(password); // 암호화하지 않은 비밀번호 전송
      closeModal();
    } else {
      alert("4자리의 숫자만 입력하세요.");
    }
  };

  const closeModal = () => {
    setPasswordModalData((prevData) => ({
      ...prevData,
      isOpen: false
    }));
    setPassword(""); // 모달이 닫힐 때 비밀번호 초기화
  };

  // 비밀번호 입력값이 변경될 때마다 상태 업데이트
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Modal
      isOpen={passWordmodalData.isOpen}
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
        <div id="modalDiv">
          <h1 id="modalInfo">비밀번호 입력</h1>
          <div id="modalContent">
            <input
              className="joinPasswordInput"
              type="password"
              placeholder="계좌 비밀번호 4자리"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
        </div>
      </div>
      <Button
        className="global-modal-button"
        shape="rect"
        onClick={onClickConfirmButton}
      >
        {passWordmodalData.confirmButtonText}
      </Button>
    </Modal>
  );
}

export default PasswordModal;