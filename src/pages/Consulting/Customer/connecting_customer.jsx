import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React, { useState, useEffect, useRef } from "react";
import "./connecting_customer.scss";
import ConsultVideo from "@/components/Video/index";

function Consulting() {
  const [isMuted, setIsMuted] = useState(false); // 음소거 State
  const [callDuration, setCallDuration] = useState(0); // 화상 상담 시간 State
  const [isCallActive, setIsCallActive] = useState(false); // 화상 상담 활성 여부 State
  const largeVideoRef = useRef(null); // largeVideoRef 정의

  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isCallActive]);

  // 화상 상담 시작 함수
  const handleCallStart = () => {
    setIsCallActive(true);
  };

  // 화상 상담 종료 함수
  const handleCallEnd = () => {
    setIsCallActive(false);
  };

  // 음소거 전환 함수
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="serviceContainer">
      <div id="consultLeftSection">
        <ConsultVideo
          isMuted={isMuted}
          onCallStart={handleCallStart}
          onCallEnd={handleCallEnd}
          largeVideoRef={largeVideoRef} // largeVideoRef 전달
          onShareScreen={() => {}} // 화면 공유 함수 전달
        />
      </div>
      <div id="consultRightSection">
        <CallInfo
          onToggleMute={handleToggleMute}
          isMuted={isMuted}
          duration={callDuration}
          onShareScreen={() => {}} // Add the missing onShareScreen property
        />
        <Chat />
      </div>
    </div>
  );
}

export default Consulting;
