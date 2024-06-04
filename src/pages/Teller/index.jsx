import React, { useState, useEffect } from "react";
import ConsultVideo from "@/components/Video/";
import CallInfo from "@/components/CallInfo/";
import Chat from "@/components/Chat/";
import "./style.scss"; // teller 전용 스타일
import { useRef } from "react";
import CustomerInfo from "@/components/CustomerInfo";

function Teller() {
  const [isMuted, setIsMuted] = useState(false); // 음소거 State
  const [callDuration, setCallDuration] = useState(0); // 화상 상담 시간 State
  const [isCallActive, setIsCallActive] = useState(false); // 화상 상담 활성 여부 State

  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 시그널링 서버 연결
    const socket = new WebSocket("ws://127.0.0.1:8080/WebRTC/signaling");
    setSignalingSocket(socket);

    // 피어 연결 설정
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    setPeerConnection(pc);

    // 이벤트 리스너 설정
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
      // 컴포넌트 언마운트 시 정리
      pc.close();
      socket.close();
    };
  }, []);

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

  const [customerInfo, setCustomerInfo] = useState(null); // 손님 정보 State

  const largeVideoRef = useRef(null); // largeVideoRef 정의

  // 스크롤 방지 및 뷰포트 높이 조정
  useEffect(() => {
    // 함수 정의
    const setScreenSize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // 함수 호출
    setScreenSize();

    // resize 이벤트 리스너 등록
    window.addEventListener("resize", setScreenSize);

    // cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", setScreenSize);
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
  // 서버에서 손님 정보 가져오기
  // useEffect(() => {
  //   const fetchCustomerInfo = async () => {
  //     try {
  //       const response = await fetch('/api/customer-info'); // 실제 API 엔드포인트로 교체
  //       const data = await response.json();
  //       setCustomerInfo(data);
  //     } catch (error) {
  //       console.error('Error fetching customer info:', error);
  //     }
  //   };

  //   fetchCustomerInfo();
  // }, []);

  // 화면 공유 시작 함수
  const handleShareScreen = () => {
    if (largeVideoRef.current && largeVideoRef.current.startScreenSharing) {
      largeVideoRef.current.startScreenSharing();
    }
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
        />
        </div>
        
        <div className="customerInfoContainer">
          <CustomerInfo
            name="김하나"
            phoneNumber="010-0000-0000"
            idNumber="990000-1234567"
            idImage="/src/assets/images/videoPending.png" // 실제 이미지 경로로 교체
          />
        </div>
        {/* {customerInfo && (
                  <div className="customerInfoContainer">

          <CustomerInfo
            name={customerInfo.name}
            phoneNumber={customerInfo.phoneNumber}
            idNumber={customerInfo.idNumber}
            idImage={customerInfo.idImage}
          />
        )} */}
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
            />
            <Chat />
          </div>
        </div>
        <div className="inputSection">필요업무에 맞는 입력창</div>
      </div>
    </div>
  );
}

export default Teller;
