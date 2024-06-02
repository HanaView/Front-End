import CallInfo from "@/components/CallInfo/";
import Chat from "@/components/Chat/";
import React, { useState } from "react";
import "./style.scss";
import ConsultVideo from "@/components/Video/";
import TellerVideo from "@/components/Teller";


//rcfe
function Teller() {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="serviceContainer">
      <TellerVideo isMuted={isMuted}/>
      <div id="consultRightSection">
        <CallInfo onToggleMute={handleToggleMute} isMuted={isMuted}/>
        {/* <Chat/> */}
      </div>     
    </div>
  );
}

export default Teller;

