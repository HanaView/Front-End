import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

const ConsultVideo = ({ isMuted }) => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const signalingSocket = useRef(null);
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
    signalingSocket.current = new WebSocket("ws://127.0.0.1:8080/WebRTC/signaling");

    // 피어 연결 설정
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingSocket.current.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    pc.ontrack = (event) => {
      console.log("Remote track added:", event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    signalingSocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "offer":
          pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
            .then(() => {
              if (localStream) {
                localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
              }
              return pc.createAnswer();
            })
            .then(answer => pc.setLocalDescription(answer))
            .then(() => {
              signalingSocket.current.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
            })
            .catch(error => console.error("Error handling offer:", error));
          break;
        case "ice-candidate":
          if (message.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate))
              .catch(error => console.error("Error adding ICE candidate:", error));
          }
          break;
        default:
          break;
      }
    };

    return () => {
      pc.close();
      signalingSocket.current.close();
    };
  }, []);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  return (
    <div>
      <video ref={localVideoRef} className="video" autoPlay muted />
      <video ref={remoteVideoRef} className="video" autoPlay />
    </div>
  );
};
export default ConsultVideo;
