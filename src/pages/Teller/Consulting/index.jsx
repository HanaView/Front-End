import React, { useState, useEffect, useRef } from "react";
import TellerVideo from "@/components/TellerVideo";
import CallInfo from "@/components/CallInfo/";
import Chat from "@/components/Chat/";
import "./style.scss";
import CustomerInfo from "@/components/CustomerInfo";
import TaskList from "@/components/TellerTask";
import SavingTask from "@/pages/Consulting/SavingTask";
import DepositTask from "@/pages/Consulting/DepositTask";
import PasswordModal from "@/pages/_shared/Modal/PasswordModal";
import {
  messageModalAtom,
  agreementModalAtom,
  taskAtom,
  socketAtom
} from "@/stores";
import { useAtom } from "jotai";
import Card from "@/pages/Consulting/Card";
import MessageModal from "@/pages/_shared/Modal/MessageModal";
import CryptoJS from "crypto-js"; // crypto-js 라이브러리 import
import AgreementModal from "@/pages/_shared/Modal/AgreementModal";

function ConnectingTeller() {
  const [isMuted, setIsMuted] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [previousVideo, setPreviousVideo] = useState(null); // 이전 비디오 상태 저장
  const [isScreenSharing, setIsScreenSharing] = useState(false); // 화면 공유 기능을 토글
  const [receivedInfo, setReceivedInfo] = useState(null); // 받은 정보 저장
  const [messageModalData, setMessageModalData] = useAtom(messageModalAtom); // jotai를 사용한 상태 관리
  const [agreementModalData, setAgreementModalData] =
    useAtom(agreementModalAtom);

  const [activeTask] = useAtom(taskAtom);
  const [, setSocketAtom] = useAtom(socketAtom); // atom을 사용하여 WebSocket 저장

  const customerInfo = {
    name: "김하나",
    phoneNumber: "010-0000-0000",
    idNumber: "990000-1234567",
    idImage: "/src/assets/images/videoPending.png"
  };

  const largeVideoRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("wss://dan-sup.com/rtc/WebRTC/signaling");
    setSignalingSocket(socket);
    setSocketAtom(socket); // atom 저장

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    setPeerConnection(pc);

    // 데이터 채널 생성
    const dc = pc.createDataChannel("chat");

    // 데이터 채널 이벤트 리스너 설정
    dc.onopen = () => {
      console.log("Data channel opened");
    };

    dc.onclose = () => {
      console.log("Data channel closed");
    };

    dc.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    dc.onmessage = (event) => {
      console.log(event);
      console.log("Data channel message received:", event.data);
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "remote",
          message: receivedMessage.message,
          timestamp: receivedMessage.timestamp
        }
      ]);
    };

    // 데이터 채널 설정이 완료되었을 때 실행되는 함수
    const onDataChannelCreated = (event) => {
      const dc = event.channel;
      setDataChannel(dc);
    };

    // 데이터 채널 생성 이벤트 리스너 설정
    pc.ondatachannel = onDataChannelCreated;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state change:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        pc.restartIce();
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
        case "password":
          try {
            const decryptedPassword = CryptoJS.AES.decrypt(
              message.data,
              "secret-key"
            ).toString(CryptoJS.enc.Utf8);
            console.log("Decrypted Password:", decryptedPassword);
            setReceivedInfo(decryptedPassword);

            // 비밀번호 인증을 완료
            setMessageModalData({
              isOpen: true,
              children: null,
              content: (
                <div id="modalDiv">
                  <div id="modalContent">
                    <p id="modalInfo">손님이 비밀번호 인증을 완료했습니다.</p>
                  </div>
                </div>
              ),
              confirmButtonText: "확인",
              onClickConfirm: () => {
                setMessageModalData({
                  isOpen: false,
                  children: null,
                  content: null,
                  confirmButtonText: "",
                  onClickConfirm: null
                });
              }
            });
          } catch (error) {
            console.error("Error decrypting password:", error);
          }
          break;
        case "agreements_completed":
          // 약관 동의 완료 모달
          setMessageModalData({
            isOpen: true,
            children: null,
            content: (
              <div id="modalDiv">
                <div id="modalContent">
                  <p id="modalInfo">손님이 동의서 작성을 완료했습니다.</p>
                </div>
              </div>
            ),
            confirmButtonText: "확인",
            onClickConfirm: () => {
              setMessageModalData({
                isOpen: false,
                children: null,
                content: null,
                confirmButtonText: "",
                onClickConfirm: null
              });
            }
          });
        default:
          console.error("알 수 없는 메시지 타입:", message);
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

  const startScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      setScreenStream(stream);
      setPreviousVideo(largeVideoRef.current.srcObject);

      const videoTrack = stream.getVideoTracks()[0];
      const sender = peerConnection
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);
      if (sender) {
        sender.replaceTrack(videoTrack);
      } else {
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      }

      setIsScreenSharing(true);

      stream.getVideoTracks()[0].onended = () => {
        stopScreenSharing();
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert(
        "Error sharing screen. Please check your screen sharing permissions."
      );
    }
  };

  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      if (largeVideoRef.current) {
        largeVideoRef.current.srcObject = previousVideo;
      }

      const videoTrack = localStream.getVideoTracks()[0];
      const sender = peerConnection
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    }
  };

  const handleCallStart = () => {
    setIsCallActive(true);
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleMessageReceived = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleVideoContainerClick = (stream) => {
    setActiveVideo(stream);
    if (largeVideoRef.current) {
      largeVideoRef.current.srcObject = stream;
    }
  };

  // 업무 클릭 시 실행되는 함수
  const renderActiveTask = () => {
    switch (activeTask) {
      case 1002:
        return <DepositTask />;
      case 1004:
        return <SavingTask />;
      case 1008:
        return <Card />;
      case 1009:
        return <Card />;
      default:
        // TODO손님의 전체 하나은행 가입 상품 정보를 띄워함
        return null;
    }
  };

  return (
    <div className="serviceContainer teller">
      <div id="consultLeftSection">
        <TellerVideo
          isMuted={isMuted}
          onCallStart={handleCallStart}
          onCallEnd={handleCallEnd}
          peerConnection={peerConnection}
          signalingSocket={signalingSocket}
          isTeller={true}
          largeVideoRef={largeVideoRef}
          activeVideo={activeVideo}
          screenStream={screenStream}
        />
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
              onShareScreen={
                isScreenSharing ? stopScreenSharing : startScreenSharing
              }
              isScreenSharing={isScreenSharing}
            />
            <Chat
              dataChannel={dataChannel}
              messages={messages}
              onMessageReceived={handleMessageReceived}
            />
            <MessageModal />
          </div>
        </div>
        <div className="inputSection">{renderActiveTask()}</div>
        {/* {receivedInfo && (
          <div className="receivedInfoContainer">
            <p>받은 비밀번호: {receivedInfo}</p>
          </div>
        )} */}
        <AgreementModal />
      </div>
    </div>
  );
}

export default ConnectingTeller;
