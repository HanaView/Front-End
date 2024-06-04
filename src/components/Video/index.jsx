import React, { useState, useEffect, useRef } from 'react';
import "./style.scss";

const ConsultVideo = ({ isMuted, onCallStart, onCallEnd, largeVideoRef, showLargeVideo = true, onShareScreen }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [signalingSocket, setSignalingSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null); // 클릭된 비디오 State
  const [isSpeaking, setIsSpeaking] = useState(false); // 음성 감지 상태

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // const largeVideoRef = useRef(null);
  const audioAnalyserRef = useRef(null)

  useEffect(() => {
    // 로컬 미디어 스트림 가져오기
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
        setupAudioAnalyser(stream); // 오디오 분석 함수 호출
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
        case 'ice-candidate':
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

  useEffect(() => {
    if (largeVideoRef.current) {
      largeVideoRef.current.srcObject = activeVideo;
    }
  }, [activeVideo]);

  const handleCallButtonClick = () => {
    peerConnection.addStream(localStream);
    peerConnection.createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        signalingSocket.send(JSON.stringify({ type: 'offer', sdp: peerConnection.localDescription }));
      });
      onCallStart();
  };

  const handleVideoContainerClick = (stream) => {
    setActiveVideo(stream);
    if (stream === localStream) {
      largeVideoRef.current.srcObject = localStream;
    } else if (stream === remoteStream) {
      largeVideoRef.current.srcObject = remoteStream;
    }
  };

  const setupAudioAnalyser = (stream) => {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    audioAnalyserRef.current = { analyser, dataArray, animationFrameId: null };

    const detectSpeaking = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setIsSpeaking(average > 3); // 임계값 조정 가능

      audioAnalyserRef.current.animationFrameId = requestAnimationFrame(detectSpeaking);
    };

    detectSpeaking();
  };

  return (
    <div id='consultVideo'>
      <div id='videoOptions'>
        <div className='videoContainer' onClick={() => handleVideoContainerClick(localStream)}>
          <p>텔러</p>
          {localStream ? (
            <video className={`video ${isSpeaking ? 'speaking' : ''}`} ref={localVideoRef} autoPlay />
          ) : (
            <div className='videoPending'>
              <img src='/src/assets/images/videoPending.png'/>
              <p>연결 대기중 ...</p>
            </div>
          )}
        </div>
        <div className='videoContainer' onClick={() => handleVideoContainerClick(remoteStream)}>
          <p>손님</p>
          {remoteVideoRef ? (
            <video className={`video ${isSpeaking ? 'speaking' : ''}`} ref={remoteVideoRef} autoPlay />
          ) : (
            <div className='videoPending'>
              <img src='/src/assets/images/videoPending.png'/>
              <p>연결 대기중 ...</p>
            </div>
          )}
        </div>
        <div className='videoContainer' onClick={() =>  (null)}>
          <p>화면 공유</p>
          <video className='video'/>
        </div>
      </div>
      <button onClick={handleCallButtonClick}>Call</button>
      
      <div id="largeVideo">
        {activeVideo && <video ref={largeVideoRef} autoPlay />}
      </div>
    </div>
  );
};

export default ConsultVideo;
