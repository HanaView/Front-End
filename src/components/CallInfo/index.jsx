import React, { useState } from "react";
import "./style.scss";

function CallInfo({ onToggleMute, isMuted, duration }) {
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };

    return (
        <div id="customerCallInfoDiv">
            <div id="callTimer">{formatDuration(duration)}</div>
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