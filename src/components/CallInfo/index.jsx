import React, { useState } from "react";
import "./style.scss";

function CallInfo({ onToggleMute, isMuted }) {
    return (
        <div id="customerCallInfoDiv">
            <div id="callTimer">00 : 05</div>
            <div id="callControls">
                {!isMuted ?
                    <img className="callBtn" src="/src/assets/images/micOn.png" onClick={onToggleMute} alt="mic"/> :
                    <img className="callBtn" src="/src/assets/images/micOff.png" onClick={onToggleMute} alt="mic"/> 
                }
                <img className="callBtn" id="endCallBtn" src="/src/assets/images/endCallBtn.png"/>
            </div>
        </div>
    );
}

export default CallInfo;