import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React from "react";
import "./style.scss";
import ConsultVideo from "@/components/Video/";


//rcfe
function ConsultingCustomer() {
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

export default ConsultingCustomer;