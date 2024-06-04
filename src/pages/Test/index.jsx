import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { getAllDeposits } from "@/apis/deposit";
import Button from "@/components/Button";
import { globalModalAtom } from "@/stores";
import Task from "../Consulting/Task";

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
      <Task />
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
