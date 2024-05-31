import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

const WebRTCVideoCall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageQueue, setMessageQueue] = useState([]);
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenShareVideoRef = useRef(null);
  const chatInputRef = useRef(null);

  const localStreamRef = useRef(null);
  const signalingServer = useRef(null);
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    })
  );

  const reconnectAttempts = useRef(0); // 재연결 시도 횟수를 추적하는 변수
  const MAX_MESSAGE_SIZE = 4 * 1024; // 4KB
  const messageParts = []; // 청크를 저장하는 배열

  useEffect(() => {
    initializeWebSocket();
    getUserMedia();

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate 생성:", event.candidate);

        iceCandidatesQueue.push(event.candidate);
        sendIceCandidates();
      }
    };

    // 이거 안됨???
    peerConnection.current.ontrack = (event) => {
      console.log("원격 피어로부터 수신된 스트림 배열:", event.streams[0]);
      console.log("########");
      console.log(event);
      console.log(event.streams[0]);
      // {"part":0,"total":1,"content":"{\"answer\":{\"type\":\"answer\",\"sdp\":\"v=0\\r\\no=- 7962377470565020577 4 IN IP4 127.0.0.1\\r\\ns=-\\r\\nt=0 0\\r\\na=group:BUNDLE 0\\r\\na=extmap-allow-mixed\\r\\na=msid-semantic: WMS\\r\\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\\r\\nc=IN IP4 0.0.0.0\\r\\na=ice-ufrag:32R9\\r\\na=ice-pwd:x7UreoGg9nOGPZB8QWmAg5mY\\r\\na=ice-options:trickle\\r\\na=fingerprint:sha-256 3F:D5:77:EE:1B:8E:B8:EA:9F:98:15:DF:DB:DE:17:F3:6F:28:20:DE:0D:79:AA:FC:E9:9D:56:C0:59:2E:53:33\\r\\na=setup:passive\\r\\na=mid:0\\r\\na=sctp-port:5000\\r\\na=max-message-size:262144\\r\\n\"}}"}
      // 원격 비디오 표시

      console.log("event.streams.length");
      console.log(event.streams.length);

      if (remoteVideoRef.current && event.streams && event.streams.length > 0) {
        remoteVideoRef.current.srcObject = event.streams[0];
      } else {
        console.error("원격 비디오 표시 실패: 누락된 스트림 또는 요소");
      }
    };

    peerConnection.current.ondatachannel = (event) => {
      const newChannel = event.channel;
      setDataChannel(newChannel);

      newChannel.onmessage = (event) => {
        console.log("받은 메시지:", event.data);
        displayChatMessage("Remote", event.data);
      };

      newChannel.onopen = () => {
        console.log(newChannel.readyState);
        console.log("데이터 채널 열림");

        while (messageQueue.length > 0) {
          const message = messageQueue.shift();
          newChannel.send(message);
        }
      };
    };

    const createOffer = async () => {
      const newChannel = peerConnection.current.createDataChannel("chat");
      setDataChannel(newChannel);

      newChannel.onopen = () => {
        console.log("채팅용 데이터 채널이 열렸습니다.");
        while (messageQueue.length > 0) {
          const message = messageQueue.shift();
          newChannel.send(message);
        }
      };

      newChannel.onmessage = (event) => {
        console.log("받은 메시지:", event.data);
        displayChatMessage("Remote", event.data);
      };
      // 1. 로컬 피어에서 오퍼 생성 및 설정:
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      sendMessage({ offer: peerConnection.current.localDescription });
    };

    createOffer();

    return () => {
      if (signalingServer.current) signalingServer.current.close();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      if (screenShareStream)
        screenShareStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      while (messageQueue.length > 0) {
        signalingServer.current.send(JSON.stringify(messageQueue.shift()));
      }
      sendIceCandidates();
    }
  }, [isConnected, messageQueue]);

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
      }
    }
  }, [isMuted]);

  const initializeWebSocket = () => {
    signalingServer.current = new WebSocket(
      "ws://127.0.0.1:8080/WebRTC/signaling"
    );

    signalingServer.current.onopen = () => {
      console.log("웹소켓 열림");
      setIsConnected(true);
      reconnectAttempts.current = 0;

      while (messageQueue.length > 0) {
        signalingServer.current.send(JSON.stringify(messageQueue.shift()));
      }

      sendIceCandidates();
    };

    // 웹소켓 메시지 수신: data에는 JSON 문자열이 포함됨
    // JSON 문자열을 파싱하여 processMessage 함수로 전달?
    // processMessage 함수는 data에 따라 다른 동작을 수행함
    // processMessage 함수는 offer, answer, ice, part 등의 키를 가진 객체를 처리함
    // part 키는 메시지가 여러 부분으로 나누어져 전송되었을 때 사용됨
    // 메시지가 여러 부분으로 나누어져 전송되면 part 키가 포함된 객체를 처리하고, 마지막 부분이 수신되면 전체 메시지를 처리함
    // processMessage 함수는 handleRemoteIceCandidate, handleOffer, handleAnswer, handleMessagePart 함수를 호출함
    // handleRemoteIceCandidate 함수는 원격 ICE 후보를 처리함
    // handleOffer 함수는 원격 피어로부터 받은 offer를 처리함
    // handleAnswer 함수는 원격 피어로부터 받은 answer를 처리함
    // handleMessagePart 함수는 메시지의 부분을 처리함
    // handleMessagePart 함수는 part 키가 포함된 객체를 받아서 messageParts 배열에 부분을 저장함
    // 모든 부분을 수신하면 messageParts 배열을 조합하여 전체 메시지를 처리함
    signalingServer.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log("받은 메시지:", data);
      // console.log("######");
      // console.log(typeof data);
      // console.log(message.data);

      processMessage(data);
    };

    signalingServer.current.onclose = (event) => {
      console.log("웹소켓 닫힘:", event);
      setIsConnected(false);
      reconnectWebSocket();
    };

    signalingServer.current.onerror = (error) => {
      console.error("웹소켓 에러:", error);
      signalingServer.current.close();
    };
  };

  const reconnectWebSocket = () => {
    const reconnectDelay = Math.min(
      1000 * Math.pow(2, reconnectAttempts.current),
      30000
    );
    setTimeout(initializeWebSocket, reconnectDelay);
  };

  const getUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => {
          console.log("track");
          console.log(track);
          peerConnection.current.addTrack(track, stream);
        });
      })
      .catch((error) => console.error("Error accessing media devices.", error));
  };

  const sendMessage = (message) => {
    const sendOrQueueMessage = (message) => {
      if (signalingServer.current.readyState === WebSocket.OPEN) {
        const jsonString = JSON.stringify(message);
        const totalParts = Math.ceil(jsonString.length / MAX_MESSAGE_SIZE);

        for (let i = 0; i < totalParts; i++) {
          const messagePart = jsonString.slice(
            i * MAX_MESSAGE_SIZE,
            (i + 1) * MAX_MESSAGE_SIZE
          );

          const partMessage = JSON.stringify({
            part: i,
            total: totalParts,
            content: messagePart
          });
          signalingServer.current.send(partMessage);
        }
      } else {
        console.error("WebSocket is not open. Queuing message:", message);
        setMessageQueue((prevQueue) => [...prevQueue, message]);
      }
    };

    if (signalingServer.current.readyState === WebSocket.CONNECTING) {
      console.error("WebSocket is still connecting. Queuing message:", message);
      setMessageQueue((prevQueue) => [...prevQueue, message]);
    } else {
      sendOrQueueMessage(message);
    }
  };

  const sendIceCandidates = () => {
    if (isConnected) {
      while (iceCandidatesQueue.length > 0) {
        sendMessage({ ice: iceCandidatesQueue.shift() });
      }
    }
  };

  const processMessage = (data) => {
    if (data.ice === 'candidate' && isConnected) {
      handleRemoteIceCandidate(data.ice);
    } else if (data.offer === 'offer') {
      handleOffer(data.offer);

    } else if (data.answer === 'answer' && isConnected) {
      handleAnswer(data.answer);

    } else if (data.part !== undefined && data.content !== undefined) {
      handleMessagePart(data);
    }
  };

  const handleRemoteIceCandidate = (candidate) => {
    if (peerConnection.current.remoteDescription) {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      iceCandidatesQueue.push(candidate);
    }
  };

  const handleOffer = async (offer) => {
    try {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      console.log("원격 오퍼가 성공적으로 설정되었습니다.");

      if (peerConnection.current.signalingState === "have-remote-offer") {
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        console.log("로컬 응답이 성공적으로 생성 및 설정되었습니다.");

        // 생성한 응답을 상대방에게 보냅니다.
        sendMessage({ answer: peerConnection.current.localDescription });
      } else {
        console.warn(
          `잘못된 상태에서 createAnswer 또는 setLocalDescription 호출: ${peerConnection.current.signalingState}`
        );
      }
    } catch (error) {
      console.error("원격 오퍼 설정 중 오류 발생:", error);
    }
  };

  // 이전 offer에서 가져온 미디어 유형의 순서를 기반으로 현재 offer의 SDP를 재정렬하는 함수
  const reorderMediaTypesInSdp = (sdp, mediaTypes) => {
    const lines = sdp.split("\r\n");
    const reorderedLines = [];
    const otherLines = [];

    // SDP를 라인별로 분리하여 미디어 유형에 따라 재정렬
    for (const line of lines) {
      if (mediaTypes.some((mediaType) => line.startsWith(mediaType))) {
        reorderedLines.push(line);
      } else {
        otherLines.push(line);
      }
    }

    // 재정렬된 미디어 유형 라인들을 하나의 문자열로 결합하여 반환
    return [...reorderedLines, ...otherLines].join("\r\n");
  };

  const handleAnswer = async (answer) => {
    // SDP 상태 체크: 로컬 오퍼가 생성된 상태인지 확인
    if (peerConnection.current.signalingState === "have-local-offer") {
      try {
        // 원격 SDP 응답 설정
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        console.log("원격 SDP가 성공적으로 설정되었습니다.");
      } catch (error) {
        console.error("원격 SDP 설정 중 오류 발생:", error);
      }
    } else {
      console.warn(
        `###잘못된 상태에서 setRemoteDescription 호출: ${peerConnection.current.signalingState}`
      );
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const stopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track) => track.stop());
      setScreenShareStream(null);
      screenShareVideoRef.current.srcObject = null;
    }
  };

  const handleMessagePart = ({ part, total, content }) => {
    messageParts[part] = content;
    if (messageParts.length === total) {
      const completeMessage = messageParts.join("");
      messageParts.length = 0; // Clear the array for the next message
      const message = JSON.parse(completeMessage);
      processMessage(message);
    }
  };

  const displayChatMessage = (sender, message) => {
    const newMessage = {
      sender,
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSendMessage = () => {
    const message = chatInputRef.current.value;
    if (message.trim() !== "" && dataChannel) {
      if (dataChannel.readyState === "open") {
        dataChannel.send(message);
        displayChatMessage("Local", message);
        chatInputRef.current.value = "";
      } else {
        console.error("DataChannel is not open. Message not sent:", message);
      }
    }
  };

  return (
    <div>
      <div>
        <button onClick={stopScreenShare}>화면 공유 중지</button>
        <button onClick={handleToggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
      <div>
        <video ref={localVideoRef} autoPlay playsInline></video>
        <video ref={remoteVideoRef} autoPlay playsInline></video>
        <video ref={screenShareVideoRef} autoPlay playsInline></video>
      </div>
      <div>
        <input
          ref={chatInputRef}
          type="text"
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}:</strong> {message.content}{" "}
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebRTCVideoCall;
