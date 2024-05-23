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
    width: "406px",
    height: "328px",
    borderRadius: "22px"
  }
};

function GlobalModal() {
  const [modalData, setModalData] = useAtom(globalModalAtom);
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  const closeModal = () => {
    setModalData(initialModalState);
  };
  const onClickConfirmButton = () => {
    if (modalData.onClickConfirm) modalData.onClickConfirm();
    else closeModal();
  };

  return (
    <Modal
      isOpen={modalData.isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      // @ts-ignore
      style={customStyles}
      overlayClassName={"global-modal-overlay"}
    >
      <Button color="default" className="right close-btn" onClick={closeModal}>
        x
      </Button>
      <div className="center">
        {modalData.children ? (
          modalData.children
        ) : (
          <span>modalData.content</span>
        )}
      </div>
      <Button
        className="global-modal-button"
        shape="rect"
        onClick={onClickConfirmButton}
      >
        {modalData.confirmButtonText ? modalData.confirmButtonText : "확인"}
      </Button>
    </Modal>
  );
}

export default GlobalModal;
