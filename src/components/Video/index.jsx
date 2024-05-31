import React, { useState, useEffect, useRef } from "react";

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

    peerConnection.current.ontrack = (event) => {
      console.log("원격 피어로부터 수신된 스트림 배열:", event.streams[0]);
      setRemoteStream(event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.ondatachannel = (event) => {
      const newChannel = event.channel;
      setDataChannel(newChannel);

      newChannel.onopen = () => {
        console.log("데이터 채널 열림");
        while (messageQueue.length > 0) {
          const message = messageQueue.shift();
          newChannel.send(message);
        }
      };

      newChannel.onmessage = (event) => {
        console.log("받은 메시지:", event.data);
        displayChatMessage("Remote", event.data);
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

    signalingServer.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
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
          peerConnection.current.addTrack(track, stream);
        });
      })
      .catch((error) => console.error("Error accessing media devices.", error));
  };

  const sendMessage = (message) => {
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
      console.error(
        "WebSocket이 연결되지 않았습니다. 메시지를 보내지 못했습니다:",
        message
      );
      setMessageQueue((prevQueue) => [...prevQueue, message]);
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
    if (data.ice) {
      handleRemoteIceCandidate(data.ice);
    } else if (data.offer) {
      handleOffer(data.offer);
    } else if (data.answer) {
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
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    sendMessage({ answer: peerConnection.current.localDescription });

    while (iceCandidatesQueue.length > 0) {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(iceCandidatesQueue.shift())
      );
    }
  };

  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    while (iceCandidatesQueue.length > 0) {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(iceCandidatesQueue.shift())
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
