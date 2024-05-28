import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React from "react";
import "./style.scss";
import Consulting from "@/components/Video/index";


//rcfe
function Consulting() {
  return (
    <div className="serviceContainer">
      <Consulting />
      <CallInfo/>
      <Chat/>
    </div>
  );
}

export default Consulting;