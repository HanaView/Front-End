import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTest } from "@/apis/user";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { UserTypes } from "@/stores/type";
import useMain from "./useMain";

function Main() {
  const navigate = useNavigate();

  // const { data } = useQuery({
  //   queryKey: ["test"],
  //   queryFn: () => getTest()
  // });


  const { onChangeUserType } = useMain();


  // if (!data) return <></>;

  return (
    <>
      {/* <p>{data.description}</p> */}
      <Button onClick={() => navigate("/test")}>TEST</Button>
      <Button onClick={() => navigate("/auth")}>AUTH</Button>
      <Button onClick={() => navigate("/camera")}>CAMERA</Button>
      <Button
        size="large"
        shape="rect"
        onClick={() => onChangeUserType(UserTypes.CUSTOMER)}
      >
        Customer
      </Button>
      <Button
        size="large"
        shape="rect"
        onClick={() => onChangeUserType(UserTypes.TELLER)}
      >
        Teller
      </Button>
    </>
  );
}

export default Main;
