import Button from "@/components/Button";
import React from "react";

function Test() {
  return (
    <div>
      <Button size="large" shape="rect" onClick={() => console.log("??")}>
        go
      </Button>
    </div>
  );
}

export default Test;
