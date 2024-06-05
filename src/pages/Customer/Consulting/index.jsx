import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React, { useState, useEffect } from "react";
import "./index.scss";
import ConsultVideo from "@/components/Video/index";

//rcfe
function Consulting() {
  const [isMuted, setIsMuted] = useState(false); // 음소거 State
  const [callDuration, setCallDuration] = useState(0); // 화상 상담 시간 State
  const [isCallActive, setIsCallActive] = useState(false); // 화상 상담 활성 여부 State

  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 시그널링 서버 연결
    const socket = new WebSocket('ws://127.0.0.1:8080/WebRTC/signaling');
    setSignalingSocket(socket);

    // 피어 연결 설정
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });
    setPeerConnection(pc);

    // 이벤트 리스너 설정
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);                                                                                                                                                                                                                                                                                                                                                                                                              
      switch (message.type) {
        case 'offer':
          if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .then(() => pc.createAnswer())
              .then((answer) => pc.setLocalDescription(answer))
              .then(() => {
                socket.send(JSON.stringify({ type: 'answer', sdp: pc.localDescription }));
              })
              .catch((error) => {
                console.error('Error setting remote description:', error);
              });
          } else {
            console.error('Invalid offer message:', message);
          }
          break;
        case 'answer':
          if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .catch((error) => {
                console.error('Error setting remote description:', error);
              });
          } else {
            console.error('Invalid answer message:', message);
          }
          break;
        case 'ice-candidate':
          if (message.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate))
              .catch((error) => {
                console.error('Error adding ICE candidate:', error);
              });
          } else {
            console.error('Invalid ICE message:', message);
          }
          break;
      }
    };

    return () => {
      // 컴포넌트 언마운트 시 정리
      pc.close();
      socket.close();
    };
  }, []);

  // 화상 상담 시작 함수
  const handleCallStart = () => {
    setIsCallActive(true);
  };

  // 화상 상담 종료 함수
  const handleCallEnd = () => {
    setIsCallActive(false);
  };

  // 화상 상담 시간 변경
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
          peerConnection={peerConnection}
          signalingSocket={signalingSocket}
          isTeller={false} // Add the missing isTeller property
        />
      </div>
      <div id="consultRightSection">
        <CallInfo
          onToggleMute={handleToggleMute}
          isMuted={isMuted}
          duration={callDuration}
          isTeller={false}
          onShareScreen={null} // Add the missing onShareScreen property
        />
        <Chat/>
      </div>     
    </div>
  );
}

export default Consulting;
