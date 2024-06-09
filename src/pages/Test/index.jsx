import React from "react";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import { globalModalAtom } from "@/stores";
import SavingTask from "../Consulting/SavingTask";
import DepositTask from "../Consulting/DepositTask";
import CardTask from "../Consulting/Card";

function Test() {
  const [modalData, setModalData] = useAtom(globalModalAtom);

  const onClickButton = () => {
    setModalData((prevState) => ({
      ...prevState,
      isOpen: true,
      content: "하이"
    }));
  };

  const onClickButton2 = () => {
    setModalData((prevState) => ({
      ...prevState,
      isOpen: true,
      children: (
        <div>
          <span style={{ color: "red" }}>안녕?</span>
          <br />
          <span style={{ color: "red" }}>안녕?</span>
        </div>
      )
    }));
  };

  return (
    <>
      <CardTask />
      <SavingTask />
      <DepositTask />
      <div>
        <Button size="large" shape="rect" onClick={onClickButton}>
          go
        </Button>
        <Button size="large" shape="rect" onClick={onClickButton2}>
          go2
        </Button>
      </div>
    </>
  );
}

export default Test;
