import React, { useState } from "react";
import "./style.scss";
import Modal from "react-modal";
import Button from "../../../../components/Button";
import { useAtom } from "jotai";
import { messageModalAtom } from "@/stores";

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

function MessageModal() {
  const [messageModalData, setMessageModalData] = useAtom(
    messageModalAtom
  );

  const onClickConfirmButton = () => {
    if (messageModalData.onClickConfirm) {
      messageModalData.onClickConfirm();
    }
    closeModal();
  };


  const closeModal = () => {
    setMessageModalData((prevData) => ({
      ...prevData,
      isOpen: false
    }));
  };

  return (
    <Modal
      isOpen={messageModalData.isOpen}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <div className="center">
        {messageModalData.content}
      </div>
      <Button
        className="global-modal-button"
        shape="rect"
        onClick={onClickConfirmButton}
      >
        {messageModalData.confirmButtonText}
      </Button>
    </Modal>
  );
}

export default MessageModal;
