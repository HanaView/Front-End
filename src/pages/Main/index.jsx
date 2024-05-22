import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTest } from "@/apis/user";

function Main() {
  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: () => getTest()
  });

  if (!data) return <></>;

  return <>{<p>{data.description}</p>}</>;
}

export default Main;
