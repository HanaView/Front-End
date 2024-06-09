import CallInfo from "@/components/CallInfo";
import Chat from "@/components/Chat";
import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import ConsultVideo from "@/components/CustomerVideo/";
import PasswordModal from "@/pages/_shared/Modal/PasswordModal";
import { passwordRequestlModalAtom } from "@/stores";
import { useAtom } from "jotai";

//rcfe
function Consulting() {
  const [isMuted, setIsMuted] = useState(false); // 음소거 State
  const [callDuration, setCallDuration] = useState(0); // 화상 상담 시간 State
  const [isCallActive, setIsCallActive] = useState(false); // 화상 상담 활성 여부 State

  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null); // peerConnection State
  const [dataChannel, setDataChannel] = useState(null); // 채팅용 데이터 채널 State
  const [messages, setMessages] = useState([]); // 채팅 메시지 배열
  const [screenStream, setScreenStream] = useState(null);
  const [previousStream, setPreviousStream] = useState(null); // 이전 화면 상태 저장
  const [passWordmodalData, setPasswordModalData] = useAtom(
    passwordRequestlModalAtom
  ); // jotai를 사용한 상태 관리

  const largeVideoRef = useRef(null);

  useEffect(() => {
    // 시그널링 서버 연결
    const socket = new WebSocket("ws://dan-sup.com/rtc/WebRTC/signaling");
    setSignalingSocket(socket);

    // 피어 연결 설정
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

    // 데이터 채널 설정이 완료되었을 때 실행되는 함수
    const onDataChannelCreated = (event) => {
      const dc = event.channel;
      setDataChannel(dc);
    };

    // 데이터 채널 생성 이벤트 리스너 설정
    pc.ondatachannel = onDataChannelCreated;

    // 이벤트 리스너 설정
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };
    pc.ontrack = (event) => {
      // 첫 번째 미디어 스트림(event.streams[0])을 콘솔에 출력
      console.log("Received remote track:", event.streams[0]);
      const newStream = event.streams[0];

      console.log(newStream.getVideoTracks()[0].label);

      if (newStream.getVideoTracks()[0].label.includes("screen")) {
        // 이는 현재 largeVideoRef 비디오 요소에 표시된 스트림을 previousStream 상태로 설정합니다. 이를 통해 화면 공유가 중지되었을 때 이전 스트림으로 복원
        setPreviousStream(
          largeVideoRef.current ? largeVideoRef.current.srcObject : null
        );
        setScreenStream(newStream);
        if (largeVideoRef.current) {
          largeVideoRef.current.srcObject = newStream;
        }
        newStream.getVideoTracks()[0].onended = () => {
          stopScreenSharing();
        };
      } else {
        console.log("###");
        console.log(newStream.getVideoTracks()[0].label);

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
        case "SHOW_MODAL":
          setPasswordModalData({
            isOpen: true,
            children: null,
            content: (
              <input
                className="joinPasswordInput"
                type="password"
                placeholder="비밀번호를 입력해주세요"
              />
            ),
            confirmButtonText: "확인",
            onClickConfirm: () => {
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
        default:
          console.error("알 수 없는 메시지 타입:", message);
          break;
      }
    };

    return () => {
      // 컴포넌트 언마운트 시 정리
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
    </div>
  );
}

export default Consulting;
