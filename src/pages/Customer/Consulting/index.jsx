import React, { useState, useEffect, useRef } from "react";
import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import ConsultVideo from "@/components/CustomerVideo/";
import PasswordModal from "@/pages/_shared/Modal/PasswordModal";
import { passwordRequestlModalAtom, agreementModalAtom } from "@/stores";
import { useAtom } from "jotai";
import CryptoJS from "crypto-js";
import "./index.scss";
import AgreementModal from "@/pages/_shared/Modal/AgreementModal";

function Consulting() {
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [screenStream, setScreenStream] = useState(null);
  const [previousStream, setPreviousStream] = useState(null);
  const [passWordmodalData, setPasswordModalData] = useAtom(passwordRequestlModalAtom);
  const [agreementModalData, setAgreementModalData] = useAtom(agreementModalAtom);

  const largeVideoRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080/WebRTC/signaling");
    setSignalingSocket(socket);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    setPeerConnection(pc);

    const dc = pc.createDataChannel("chat");

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
      console.log("Data channel message received:", event.data);
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "remote",
          message: receivedMessage.message,
          timestamp: receivedMessage.timestamp
        }
      ]);
    };

    const onDataChannelCreated = (event) => {
      const dc = event.channel;
      setDataChannel(dc);
    };

    pc.ondatachannel = onDataChannelCreated;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    pc.ontrack = (event) => {
      const newStream = event.streams[0];
      if (newStream.getVideoTracks()[0].label.includes("screen")) {
        setPreviousStream(largeVideoRef.current ? largeVideoRef.current.srcObject : null);
        setScreenStream(newStream);
        if (largeVideoRef.current) {
          largeVideoRef.current.srcObject = newStream;
        }
        newStream.getVideoTracks()[0].onended = () => {
          stopScreenSharing();
        };
      } else {
        setPreviousStream(newStream);
        if (!screenStream && largeVideoRef.current) {
          largeVideoRef.current.srcObject = newStream;
        }
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
          case "show_pwInputModal":
            setPasswordModalData({
              isOpen: true,
              children: null,
              confirmButtonText: "확인",
              content: "",
              onClickConfirm: (password) => {
                const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();
                console.log("Encrypted password:", encryptedPassword);
  
                // Send encrypted password via WebSocket
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(
                    JSON.stringify({ type: "password", data: encryptedPassword })
                  );
                  console.log("Password sent via WebSocket");
                }
  
                setPasswordModalData({
                  isOpen: false,
                  children: null,
                  content: null,
                  confirmButtonText: "",
                  onClickConfirm: null
                });
              }
            });
            break;
          // 약관 모달 띄우기
          case "SHOW_AGREEMENT_MODAL":
            setAgreementModalData({
              isOpen: true,
              children: null,
              confirmButtonText: "확인",
              content: "",
              onClickConfirm: () => {

                setAgreementModalData({
                  isOpen: false,
                  children: null,
                  content: null,
                  confirmButtonText: "",
                  onClickConfirm: null
                });
              }});
            break;
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

  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      if (largeVideoRef.current) {
        largeVideoRef.current.srcObject = previousStream;
      }
    }
  };

  const handleCallStart = () => {
    setIsCallActive(true);
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
  };

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

  const handleToggleMute = () => {
    setIsMuted(isMuted);
  };

  const handleMessageReceived = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.onended = () => {
          console.log("Screen sharing stopped");
          if (largeVideoRef.current) {
            largeVideoRef.current.srcObject = previousStream;
          }
          setScreenStream(null);
        };
      });
    }
  }, [screenStream, previousStream]);

  return (
    <div className="serviceContainer">
      <div id="consultLeftSection">
        <ConsultVideo
          isMuted={isMuted}
          onCallStart={handleCallStart}
          onCallEnd={handleCallEnd}
          peerConnection={peerConnection}
          signalingSocket={signalingSocket}
        />
      </div>
      <div id="consultRightSection">
        <CallInfo
          onToggleMute={handleToggleMute}
          isMuted={isMuted}
          duration={callDuration}
          isTeller={false}
          onShareScreen={undefined}
          isScreenSharing={false}
        />
        <Chat
          dataChannel={dataChannel}
          messages={messages}
          onMessageReceived={handleMessageReceived}
        />
      </div>
      <PasswordModal />
      <AgreementModal/>
    </div>
  );
}

export default Consulting;
