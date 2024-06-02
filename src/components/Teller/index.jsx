import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

const ConsultTeller = ({ isMuted }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // 로컬 미디어 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

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

    pc.ontrack = (event) => {
      console.log("@@Remote track added:", event.streams[0]);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      } else {
        console.error("No streams available on track event.");
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "answer":
          if (message.sdp) {
            console.log("@@Received answer:", message.sdp);
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .then(() => {
                console.log('Remote description set successfully.');
              })
              .catch((error) => {
                console.error('Error setting remote description:', error);
              });
          } else {
            console.error('Invalid answer message:', message);
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
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  const handleCallButtonClick = () => {
    console.log("Call button clicked");
    console.log("Local stream:", localStream);
    console.log("Remote stream:", remoteStream);

    if (localStream && peerConnection) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          signalingSocket.send(
            JSON.stringify({
              type: "offer",
              sdp: peerConnection.localDescription
            })
          );
        });
    } else {
      console.error("Local stream or peerConnection is not available");
    }
  };

  return (
    <div>
      <video ref={localVideoRef} className="video" autoPlay muted />
      <video ref={remoteVideoRef} className="video" autoPlay />
      <button onClick={handleCallButtonClick}>통화</button>
    </div>
  );
};

export default ConsultTeller;
