import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React from "react";
import "./style.scss";
import WebRTCVideoCall from "@/components/Video/";


//rcfe
function Consulting() {
  return (
    <div className="serviceContainer">
      <WebRTCVideoCall />
      <CallInfo/>
      <Chat/>
    </div>
  );
}

export default Consulting;