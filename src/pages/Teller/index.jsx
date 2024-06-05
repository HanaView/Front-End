import React, { useState, useEffect, useRef } from "react";
import ConsultVideo from "@/components/Video/";
import CallInfo from "@/components/CallInfo/";
import Chat from "@/components/Chat/";
import "./style.scss";
import CustomerInfo from "@/components/CustomerInfo";

function ConnectingTeller() {
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [customerInfo, setCustomerInfo] = useState(null);

  const customerInfo = {
    name: "김하나",
    phoneNumber: "010-0000-0000",
    idNumber: "990000-1234567",
    idImage: "/src/assets/images/videoPending.png",
  };

  const largeVideoRef = useRef(null);
  const consultVideoRef = useRef(null); // ConsultVideo 컴포넌트를 참조합니다.

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080/WebRTC/signaling");
    setSignalingSocket(socket);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "offer":
          if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .then(() => pc.createAnswer())
              .then((answer) => pc.setLocalDescription(answer))
              .then(() => {
                socket.send(
                  JSON.stringify({ type: "answer", sdp: pc.localDescription })
                );
              })
              .catch((error) => {
                console.error("Error setting remote description:", error);
              });
          } else {
            console.error("Invalid offer message:", message);
          }
          break;
        case "answer":
          if (message.sdp) {
            pc.setRemoteDescription(
              new RTCSessionDescription(message.sdp)
            ).catch((error) => {
              console.error("Error setting remote description:", error);
            });
          } else {
            console.error("Invalid answer message:", message);
          }
          break;
        case "ice-candidate":
          if (message.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch(
              (error) => {
                console.error("Error adding ICE candidate:", error);
              }
            );
          } else {
            console.error("Invalid ICE message:", message);
          }
          break;
      }
    };

    return () => {
      pc.close();
      socket.close();
    };
  }, []);

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

  const handleCallStart = () => {
    setIsCallActive(true);
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleShareScreen = () => {
    if (consultVideoRef.current && consultVideoRef.current.startScreenSharing) {
      consultVideoRef.current.startScreenSharing();
    }
  };
  
  const handleMessageReceived = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="serviceContainer teller">
      <div id="consultLeftSection">
        <div className="videoContainer">
          <ConsultVideo
            isMuted={isMuted}
            onCallStart={handleCallStart}
            onCallEnd={handleCallEnd}
            peerConnection={peerConnection}
            signalingSocket={signalingSocket}
            isTeller={true}
            largeVideoRef={largeVideoRef}          />
        </div>
        <div className="customerInfoContainer">
          <CustomerInfo
            name={customerInfo.name}
            phoneNumber={customerInfo.phoneNumber}
            idNumber={customerInfo.idNumber}
            idImage={customerInfo.idImage}
          />
        </div>
      </div>
      <div id="consultRightSection">
        <div id="mainContent">
          <div className="selectedScreen">
            <div id="largeVideoContainer">
              <video id="largeVideo" ref={largeVideoRef} autoPlay />
            </div>
          </div>
          <div id="sideContent">
            <CallInfo
              onToggleMute={handleToggleMute}
              isMuted={isMuted}
              duration={callDuration}
              isTeller={true}
              onShareScreen={handleShareScreen}
            />
   <Chat
          dataChannel={dataChannel}
          messages={messages}
          onMessageReceived={handleMessageReceived}/>
      </div>            
        </div>
        <div className="inputSection">필요업무에 맞는 입력창</div>
      </div>
    </div>
  );
}

export default ConnectingTeller;
