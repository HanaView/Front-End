import React, { useState } from "react";
import "./style.scss";
import Modal from "react-modal";
import Button from "../../../../components/Button";
import { useAtom } from "jotai";
import { customerInfoModalAtom } from "@/stores";

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
    width: "400px",
    height: "750px",
    borderRadius: "22px"
  }
};

function CustomerInfoModal() {
  const [customerInfoModalData, setCustomerInfoModalData] = useAtom(
    customerInfoModalAtom
  );

  const onClickConfirmButton = () => {
    if (customerInfoModalData.onClickConfirm) {
      customerInfoModalData.onClickConfirm();
    }
    closeModal();
  };

  const closeModal = () => {
    setCustomerInfoModalData((prevData) => {
      return {
        ...prevData,
        isOpen: false
      };
    });
  };
  

  return (
    <Modal
      isOpen={customerInfoModalData.isOpen}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <div className="center">{customerInfoModalData.content}</div>
      <Button
        className="global-modal-button"
        shape="rect"
        onClick={onClickConfirmButton}
      >
        {customerInfoModalData.confirmButtonText}
      </Button>
    </Modal>
  );
}

export default CustomerInfoModal;
