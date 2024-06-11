import React, { useState, useEffect, useRef } from "react";
import TellerVideo from "@/components/TellerVideo";
import CallInfo from "@/components/CallInfo/";
import Chat from "@/components/Chat/";
import "./style.scss";
import CustomerInfo from "@/components/CustomerInfo";
import SavingTask from "@/pages/Consulting/SavingTask";
import DepositTask from "@/pages/Consulting/DepositTask";
import { messageModalAtom, taskAtom, socketAtom, accountPwAtom } from "@/stores";
import { useAtom } from "jotai";
import Card from "@/pages/Consulting/Card";
import MessageModal from "@/pages/_shared/Modal/MessageModal";
import CryptoJS from "crypto-js"; // crypto-js 라이브러리 import
import AgreementModal from "@/pages/_shared/Modal/AgreementModal";
import CustomerTask from "@/pages/Consulting/CustomerTask";
import axios from "axios";
import { closeModal } from "@/components/Modal";

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
  const [accountPw, setAccountPw] = useState(null); // 받은 정보 저장
  const [messageModalData, setMessageModalData] = useAtom(messageModalAtom); // jotai를 사용한 상태 관리

  const [activeTask] = useAtom(taskAtom);
  const [, setSocketAtom] = useAtom(socketAtom); // atom을 사용하여 WebSocket 저장

  const [password, setPassword] = useAtom(accountPwAtom); // 계좌 비밀번호 저장
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  const redisKey = localStorage.getItem("key");

  const customerInfo = async (e) => {
    try {
      const response = await axios.get(
        "https://hanaview.shop/api/login/getUserInfo?key=" + redisKey
      );

      if (response.data.state == 200) {
        setName(response.data.data.user.name);
        setPhoneNumber(response.data.data.user.tele);
        setIdNumber(response.data.data.user.socialNumber);
        setImage(response.data.data.image);
      } else {
        alert(response.data.errorCode.message);
        console.error("Authentication failed:", response.data.errorCode.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("No response error:", error.request);
      } else {
        console.error("Axios error:", error.message);
      }
    }
  };

  const largeVideoRef = useRef(null);

  const createWebSocket = () => {
    const socket = new WebSocket("wss://dan-sup.com/rtc/WebRTC/signaling");
    setSignalingSocket(socket);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event.reason);
      setTimeout(createWebSocket, 1000); // 1초 후 재연결 시도
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  };

  useEffect(() => {
    customerInfo();
  }, []);

  useEffect(() => {
    const socket = createWebSocket();
    setSignalingSocket(socket);
    setSocketAtom(socket); // atom 저장

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun4.l.google.com:19302" }]
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
      setRemoteStream(event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
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
          }
          break;
        case "answer":
          if (message.sdp) {
            pc.setRemoteDescription(
              new RTCSessionDescription(message.sdp)
            ).catch((error) => {
              console.error("Error setting remote description:", error);
            });
          }
          break;
        case "ice-candidate":
          if (message.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch(
              (error) => {
                console.error("Error adding ICE candidate:", error);
              }
            );
          }
          break;
        case "password":
          try {
            const decryptedPassword = CryptoJS.AES.decrypt(
              message.data,
              "secret-key"
            ).toString(CryptoJS.enc.Utf8);
            setPassword(decryptedPassword);
            setMessageModalData({
              isOpen: true,
              children: null,
              content: (
                <div id="modalDiv">
                  <div id="modalContent">
                    <p id="modalInfo">손님이 비밀번호 입력을 완료했습니다.</p>
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
  // 이미지 클릭 핸들러
  const handleImageClick = () => {
    // setIsModalOpen(true);
    setMessageModalData({
      isOpen: true,
      children: null,
      content: (
        <img src={`data:image/jpeg;base64,${image}`} alt="얍얍얍" style={{ width: '100%', height: '90%', objectFit: 'cover'}} />
      ),
      confirmButtonText: "확인",
      onClickConfirm: () => {
        // Close the modal
        closeModal(setMessageModalData);
      }
    });
  };

  // 모달 컴포넌트
  const ImageModal = ({ image, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <img src={`data:image/jpeg;base64,${image}`} alt="얍얍얍" style={{ width: '100%', height: '50%' }} />
        </div>
      </div>
    );
  };

  const renderActiveTask = () => {
    switch (activeTask) {
      case 1002:
        return <DepositTask />;
      case 1003:
        return <SavingTask />;
      case 1006:
        return <Card />;
      case 1007:
        return <Card />;
      default:
        return <CustomerTask />;
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
            name={name}
            phoneNumber={phoneNumber}
            idNumber={idNumber}
            image={image}
            onImageClick={handleImageClick} // 이미지 클릭 핸들러 추가
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
        <div className="inputSection">
          <div id="task">{renderActiveTask()}</div>
        </div>
        <AgreementModal />
        <ImageModal image={image} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}

export default ConnectingTeller;
