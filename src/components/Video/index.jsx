import React, { useState, useEffect, useRef } from 'react';
import "./style.scss";

const ConsultVideo = ({ isMuted, onCallStart, onCallEnd }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // 로컬 미디어 스트림 가져오기
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    // 시그널링 서버 연결
    const socket = new WebSocket('ws://127.0.0.1:8080/WebRTC/signaling');
    setSignalingSocket(socket);

    // 피어 연결 설정
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });
    setPeerConnection(pc);

    // 이벤트 리스너 설정
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'offer':
          if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .then(() => pc.createAnswer())
              .then((answer) => pc.setLocalDescription(answer))
              .then(() => {
                socket.send(JSON.stringify({ type: 'answer', sdp: pc.localDescription }));
              })
              .catch((error) => {
                console.error('Error setting remote description:', error);
              });
          } else {
            console.error('Invalid offer message:', message);
          }
          break;
        case 'answer':
          if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .catch((error) => {
                console.error('Error setting remote description:', error);
              });
          } else {
            console.error('Invalid answer message:', message);
          }
          break;
        case 'ice':
          if (message.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate))
              .catch((error) => {
                console.error('Error adding ICE candidate:', error);
              });
          } else {
            console.error('Invalid ICE message:', message);
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

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  const handleCallButtonClick = () => {
    peerConnection.addStream(localStream);
    peerConnection.createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        signalingSocket.send(JSON.stringify({ type: 'offer', sdp: peerConnection.localDescription }));
      });
      onCallStart();
  };

  return (
    <div>
      <div id='videoOptions'>
        <div className='videoContainer'>
          <h2>텔러</h2>
          <video ref={localVideoRef} className='video' autoPlay />
        </div>
        <div className='videoContainer'>
          <h2>손님</h2>
          <video ref={remoteVideoRef} className='video' autoPlay />
        </div>
        <div className='videoContainer'>
          <h2>화면 공유</h2>
        </div>
      </div>
      <button onClick={handleCallButtonClick}>Call</button>
    </div>
  );
};

export default ConsultVideo;
