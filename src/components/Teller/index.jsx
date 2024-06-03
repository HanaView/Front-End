import React, { useState, useEffect, useRef } from 'react';
import "./style.scss";
import Chat from '../Chat';

const TellerVideo = ({ isMuted }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const iceCandidates = useRef([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // 채팅용
  const [dataChannel, setDataChannel] = useState(null);
  const [messages, setMessages] = useState([]);


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

        // 데이터 채널 생성
        const channel = pc.createDataChannel('chat');
        setDataChannel(channel);
    
        channel.onopen = () => {
          console.log('데이터 채널이 열렸습니다.');
        };
    
        channel.onmessage = (event) => {
          console.log('받은 메시지:', event.data);
          displayChatMessage('Customer', event.data);
        };

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
        case 'answer':
          if (message.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
              .then(() => {
                console.log('Remote description set successfully.');
                // 큐에 저장된 ICE 후보를 추가합니다.
                iceCandidates.current.forEach(candidate => {
                  pc.addIceCandidate(new RTCIceCandidate(candidate))
                    .catch((error) => {
                      console.error('Error adding ICE candidate:', error);
                    });
                });
                iceCandidates.current = [];
              })
              .catch((error) => {
                console.error('Error setting remote description:', error);
              });
          } else {
            console.error('Invalid answer message:', message);
          }
          break;
        case 'ice-candidate':
          if (message.candidate) {
            if (pc.remoteDescription) {
              pc.addIceCandidate(new RTCIceCandidate(message.candidate))
                .catch((error) => {
                  console.error('Error adding ICE candidate:', error);
                });
            } else {
              // 원격 설명이 설정될 때까지 ICE 후보를 큐에 저장합니다.
              iceCandidates.current.push(message.candidate);
            }
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
  };

  const handleSendMessage = (message) => {
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(message);
      displayChatMessage('Teller', message);
    }
  };

  const displayChatMessage = (sender, message) => {
    setMessages(prevMessages => [...prevMessages, { sender, message }]);
  };

  return (
    <div>
      <video ref={localVideoRef} className='video' autoPlay />
      <video ref={remoteVideoRef} className='video' autoPlay />
      <button onClick={handleCallButtonClick}>Call</button>
      {/* <Chat onSendMessage={handleSendMessage} messages={messages} /> */}

    </div>
  );
};

export default TellerVideo;
