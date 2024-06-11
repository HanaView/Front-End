import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import MessageModal from "@/pages/_shared/Modal/MessageModal";
import { useAtom } from "jotai";
import { messageModalAtom } from "@/stores";

const CustomerVideo = ({
  isMuted,
  onCallStart,
  onCallEnd,
  peerConnection,
  signalingSocket
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null); // 클릭된 비디오 State
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false); // 로컬 음성 감지 상태
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false); // 리모트 음성 감지 상태
  const [dotCount, setDotCount] = useState(1); // 연결 대기중 ... 의 . 개수

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const largeVideoRef = useRef(null);
  const localAudioAnalyserRef = useRef(null);
  const remoteAudioAnalyserRef = useRef(null);

  const [messageModalData, setMessageModalData] = useAtom(messageModalAtom);

  useEffect(() => {
    // 로컬 미디어 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    if (peerConnection) {
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };
    }
  }, [peerConnection]);

  useEffect(() => {
    setMessageModalData({
      isOpen: true,
      children: null,
      confirmButtonText: "상담 시작",
      content: (
        <div id="modalDiv">
          <div id="modalContent">
            <p id="modalInfo">상담을 시작하시겠습니까?</p>
          </div>
        </div>
      ),
      onClickConfirm: () => {
        handleCallButtonClick();
        setMessageModalData({
          isOpen: false,
          children: null,
          content: null,
          confirmButtonText: "",
          onClickConfirm: null
        });
      }
    });
  }, [localStream]);

  useEffect(() => {
    if (localStream) {
      setupAudioAnalyser(
        localStream,
        setIsLocalSpeaking,
        localAudioAnalyserRef
      );
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [localStream, isMuted]);

  // remoteStream이 변경될 때마다 remoteVideoRef 초기화, audioAnalyser 세팅
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      setupAudioAnalyser(
        remoteStream,
        setIsRemoteSpeaking,
        remoteAudioAnalyserRef
      ); // 리모트 오디오 분석 함수 호출
    }
  }, [remoteStream]);

  useEffect(() => {
    if (largeVideoRef.current) {
      largeVideoRef.current.srcObject = activeVideo;
    }
  }, [activeVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevDotCount) => {
        if (prevDotCount === 3) {
          return 1;
        }
        return prevDotCount + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleCallButtonClick = () => {
    if (localStream) {
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

      onCallStart();
    }
  };

  // 선택된 비디오를 크게 보여주는 함수
  const handleVideoContainerClick = (stream) => {
    setActiveVideo(stream);
    if (stream === localStream) {
      largeVideoRef.current.srcObject = localStream;
    } else if (stream === remoteStream) {
      largeVideoRef.current.srcObject = remoteStream;
    }
  };

  // 큰 비디오 보이지 않게 하는 함수
  const handleLargeVideoClick = () => {
    setActiveVideo(null);
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
      setSpeaking(average > 15); // 임계값 조정 가능

      analyserRef.current.animationFrameId =
        requestAnimationFrame(detectSpeaking);
    };

    detectSpeaking();
  };

  return (
    <div id="consultVideo" className="customerVideo">
      <div id="videoOptions">
        <div
          className="videoContainer"
          onClick={() => handleVideoContainerClick(localStream)}
        >
          <p>손님</p>
          {localVideoRef ? (
            <video
              className={`video ${isLocalSpeaking ? "speaking" : ""}`}
              ref={localVideoRef}
              autoPlay
            />
          ) : (
            <div className="videoPending">
              <img src="/src/assets/images/videoPending.png" />
              <p>연결 대기중 {".".repeat(dotCount)}</p>
            </div>
          )}
        </div>
        <div
          className="videoContainer"
          onClick={() => handleVideoContainerClick(remoteStream)}
        >
          <p>텔러</p>
          {remoteStream ? (
            <video
              className={`video ${isRemoteSpeaking ? "speaking" : ""}`}
              ref={remoteVideoRef}
              autoPlay
            />
          ) : (
            <div className="videoPending">
              <img src="/src/assets/images/videoPending.png" />
              <p>연결 대기중 {".".repeat(dotCount)}</p>
            </div>
          )}
        </div>
        {/* <div className='videoContainer' onClick={() =>  (null)}>
              <p>화면 공유</p>
              <video className='video'/>
            </div> */}
      </div>

      <div id="largeVideo">
        {activeVideo && (
          <video
            className="largeV"
            ref={largeVideoRef}
            onClick={handleLargeVideoClick}
            autoPlay
          />
        )}
      </div>
      <MessageModal />
    </div>
  );
};

export default CustomerVideo;
