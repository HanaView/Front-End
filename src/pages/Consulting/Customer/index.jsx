import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React from "react";
import "./style.scss";
import ConsultVideo from "@/components/Video/index";


//rcfe
function Consulting() {
  return (
    <div className="serviceContainer">
      <ConsultVideo />
      <div id="consultRightSection">
        <CallInfo/>
        <Chat/>
      </div>     
    </div>
  );
}

export default Consulting;