import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTest } from "@/apis/user";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  // const { data } = useQuery({
  //   queryKey: ["test"],
  //   queryFn: () => getTest()
  // });

  // if (!data) return <></>;

  return (
    <>
      {/* <p>{data.description}</p> */}
      <Button onClick={() => navigate("/test")}>TEST</Button>
      <Button onClick={() => navigate("/auth")}>AUTH</Button>
      <Button onClick={() => navigate("/camera")}>CAMERA</Button>

    </>
  );
}

export default Main;
