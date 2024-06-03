import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React from "react";
import "./connecting_customer.scss";
import ConsultVideo from "@/components/Video/";


//rcfe
function ConnectingCustomer() {
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

export default ConnectingCustomer;