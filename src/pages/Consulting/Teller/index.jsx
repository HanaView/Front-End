import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React, { useState } from "react";
import "./style.scss";
import ConsultVideo from "@/components/Video/";
import ConsultTeller from "@/components/Teller";


//rcfe
function ConsultingTeller() {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="serviceContainer">
      <ConsultTeller isMuted={isMuted}/>
      <div id="consultRightSection">
        <CallInfo onToggleMute={handleToggleMute} isMuted={isMuted}/>
        <Chat/>
      </div>     
    </div>
  );
}

export default ConsultingTeller;

