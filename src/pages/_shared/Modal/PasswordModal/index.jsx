import React from "react";
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

  const onClickConfirmButton = () => {
    passWordmodalData.onClickConfirm();
  };

  return (
    <Modal
      isOpen={passWordmodalData.isOpen}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <div className="center">
        {passWordmodalData.content}
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
