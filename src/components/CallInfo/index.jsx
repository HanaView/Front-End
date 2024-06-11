import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

function CallInfo({
  onToggleMute,
  isMuted,
  duration,
  isTeller,
  onShareScreen,
  isScreenSharing
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const navigate = useNavigate();

  const endCall = () => {
    const res = confirm("상담을 종료하시겠습니까?");
    if (!res) return;

    if (isTeller) {
      navigate("/after/teller");
    } else {
      navigate("/after/customer");
    }
  };
  return (
    <div id="customerCallInfoDiv">
      <div id="callTimer">{formatDuration(duration)}</div>
      <div id="callControls">
        {!isMuted ? (
          <img
            className="callBtn"
            src="/src/assets/images/micOn.png"
            onClick={onToggleMute}
            alt="mic"
          />
        ) : (
          <img
            className="callBtn"
            src="/src/assets/images/micOff.png"
            onClick={onToggleMute}
            alt="mic"
          />
        )}
        <img
          className="callBtn"
          id="endCallBtn"
          src="/src/assets/images/endCallBtn.png"
          onClick={endCall}
          alt="end call"
        />
        {isTeller && (
          <img
            className="shareBtn"
            id="shareScBtn"
            src={
              isScreenSharing
                ? "/src/assets/images/shareBtnOn.png"
                : "/src/assets/images/shareBtnOff.png"
            }
            onClick={onShareScreen}
            alt="share screen"
          />
        )}
      </div>
    </div>
  );
}

export default CallInfo;