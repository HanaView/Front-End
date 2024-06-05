import React, { useState, useEffect, useRef } from 'react';
import "./style.scss";

const ConsultVideo = ({ isMuted, onCallStart, onCallEnd, peerConnection, signalingSocket, isTeller, largeVideoRef, activeVideo }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  // const [activeVideo, setActiveVideo] = useState(null); // 클릭된 비디오 State
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false); // 로컬 음성 감지 상태
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false); // 리모트 음성 감지 상태
  const [dotCount, setDotCount] = useState(1); // 연결 대기중 ... 의 . 개수
  const [screenStream, setScreenStream] = useState(null); // 화면 공유 스트림

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null); // 화면 공유 비디오 참조
  const localAudioAnalyserRef = useRef(null);
  const remoteAudioAnalyserRef = useRef(null);

  // 마이크 및 카메라 존재 여부 확인 함수
  const checkMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMicrophone = devices.some(device => device.kind === 'audioinput');
      const hasCamera = devices.some(device => device.kind === 'videoinput');

      if (!hasMicrophone) {
        console.warn("마이크가 없습니다.");
      }
      if (!hasCamera) {
        console.warn("카메라가 없습니다.");
      }

      return { hasMicrophone, hasCamera };
    } catch (error) {
      console.error("장치를 확인하는 중 오류가 발생했습니다.", error);
      return { hasMicrophone: false, hasCamera: false };
    }
  };

  useEffect(() => {
    const getMedia = async () => {
      const { hasMicrophone, hasCamera } = await checkMediaDevices();

      if (hasMicrophone && hasCamera) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setLocalStream(stream);
        } catch (error) {
          console.error('Error accessing media devices:', error);
          alert('Error accessing media devices. Please check your camera and microphone.');
        }
      } else {
        if (!hasMicrophone) {
          alert('No microphone found. Please connect a microphone.');
        }
        if (!hasCamera) {
          alert('No camera found. Please connect a camera.');
        }
      }
    };

    getMedia();

    if (peerConnection) {
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };
    }
  }, [peerConnection]);

  useEffect(() => {
    if (localStream) {
      setupAudioAnalyser(localStream, setIsLocalSpeaking, localAudioAnalyserRef);
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [localStream, isMuted]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      setupAudioAnalyser(remoteStream, setIsRemoteSpeaking, remoteAudioAnalyserRef); // 리모트 오디오 분석 함수 호출
    }
  }, [remoteStream]);

  useEffect(() => {
    if (largeVideoRef && largeVideoRef.current && activeVideo) {
      largeVideoRef.current.srcObject = activeVideo;
    }
  }, [activeVideo, largeVideoRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevDotCount) => (prevDotCount === 3 ? 1 : prevDotCount + 1));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleCallButtonClick = () => {
    if (peerConnection && localStream) {
      peerConnection.addStream(localStream);
      peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          signalingSocket.send(JSON.stringify({ type: 'offer', sdp: peerConnection.localDescription }));
        });
      onCallStart();
    }
  };

  const handleVideoContainerClick = (stream) => {
    // setActiveVideo(stream);
    if (largeVideoRef && largeVideoRef.current) {
      largeVideoRef.current.srcObject = stream;
    }
  };

  const setupAudioAnalyser = (stream, setSpeaking, analyserRef) => {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyserRef.current = { analyser, dataArray, animationFrameId: null };

    const detectSpeaking = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setSpeaking(average > 3); // 임계값 조정 가능

      analyserRef.current.animationFrameId = requestAnimationFrame(detectSpeaking);
    };

    detectSpeaking();
  };

  // const startScreenSharing = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  //     if (screenVideoRef.current) {
  //       screenVideoRef.current.srcObject = stream;
  //     }
  //     setScreenStream(stream);

  //     stream.getTracks().forEach((track) => {
  //       peerConnection.addTrack(track, stream);
  //     });

  //     if (largeVideoRef && largeVideoRef.current) {
  //       largeVideoRef.current.srcObject = stream;
  //     }
  //   } catch (error) {
  //     console.error('Error sharing screen:', error);
  //     alert('Error sharing screen. Please check your screen sharing permissions.');
  //   }
  // };

  return (
    <div id='consultVideo' className={isTeller ? 'teller' : ''}>
      <div id='videoOptions'>
        <div className='videoContainer' onClick={() => handleVideoContainerClick(localStream)}>
          <p>텔러</p>
          {localVideoRef ? (
            <video className={`video ${isLocalSpeaking ? 'speaking' : ''}`} ref={localVideoRef} autoPlay />
          ) : (
            <div className='videoPending'>
              <img src='/src/assets/images/videoPending.png' />
              <p>연결 대기중 {'.'.repeat(dotCount)}</p>
            </div>
          )}
        </div>
        <div className='videoContainer' onClick={() => handleVideoContainerClick(remoteStream)}>
          <p>손님</p>
          {remoteStream ? (
            <video className={`video ${isRemoteSpeaking ? 'speaking' : ''}`} ref={remoteVideoRef} autoPlay />
          ) : (
            <div className='videoPending'>
              <img src='/src/assets/images/videoPending.png' />
              <p>연결 대기중 {'.'.repeat(dotCount)}</p>
            </div>
          )}
        </div>
        <div className='videoContainer' onClick={() => handleVideoContainerClick(screenStream)}>
          <p>화면 공유</p>
          {screenStream ? (
            <video className='video' ref={screenVideoRef} autoPlay />
          ) : (
            <div className='videoPending'>
              <img src='/src/assets/images/videoPending.png' />
            </div>
          )}
        </div>
      </div>
      <button onClick={handleCallButtonClick}>시작!</button>
    </div>
  );
};

export default ConsultVideo;
