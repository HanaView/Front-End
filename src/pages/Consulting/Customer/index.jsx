import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React from "react";
import "./style.scss";

//rcfe
function Consulting() {
  return (
    <div className="serviceContainer">
      <CallInfo/>
      <Chat/>
    </div>
  );
}

export default Consulting;
