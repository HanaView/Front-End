import React, { useState } from "react";
import "./style.scss";

function CallInfo() {
    const [isMicOn, setIsMicOn] = useState(true);

    const toggleMic = () => {
        setIsMicOn(!isMicOn);
    }

    return (
        <div id="customerCallInfoDiv">
            <div id="callTimer">00 : 05</div>
            <div id="callControls">
                {isMicOn ?
                    <img className="callBtn" src="/src/assets/images/micOn.png" onClick={toggleMic} alt="mic"/> :
                    <img className="callBtn" src="/src/assets/images/micOff.png" onClick={toggleMic} alt="mic"/> 
                }
                <img className="callBtn" id="endCallBtn" src="/src/assets/images/endCallBtn.png"/>
            </div>
        </div>
    );
}

export default CallInfo;