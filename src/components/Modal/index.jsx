import { globalModalAtom, initialModalState } from "@/stores";
import { useAtom } from "jotai";
import React from "react";
import Modal from "react-modal";
import Button from "../Button";
import "./style.scss";
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
    minWidth: "406px",
    minHeight: "328px",
    borderRadius: "22px"
  }
};

export const closeModal = (setModalData) => {
  setModalData(initialModalState);
};

function GlobalModal() {
  const [modalData, setModalData] = useAtom(globalModalAtom);

  const onClickConfirmButton = () => {
    if (modalData.onClickConfirm) modalData.onClickConfirm();
    else closeModal(setModalData);
  };

  return (
    <Modal
      isOpen={modalData.isOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={() => closeModal(setModalData)}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <Button
        color="default"
        className="right close-btn"
        onClick={() => closeModal(setModalData)}
      >
        x
      </Button>
      <div className="center">
        {modalData.children ? (
          modalData.children
        ) : (
          <span>{modalData.content}</span>
        )}
      </div>
      <Button
        className="global-modal-button"
        shape="rect"
        onClick={() => onClickConfirmButton()}
      >
        {modalData.confirmButtonText ? modalData.confirmButtonText : "확인"}
      </Button>
    </Modal>
  );
}

export default GlobalModal;
