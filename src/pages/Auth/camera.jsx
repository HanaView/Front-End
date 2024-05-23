import React, { useEffect, useState, useRef } from "react";
import './camera.scss';
function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" } // 후면 카메라 사용 설정
          }
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    getCameraStream();
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
  };

  return (
    <div className="camera-container">
      <div className="camera-preview">
        <video ref={videoRef} autoPlay playsInline></video>
        <div className="overlay"></div>
      </div>
      <button className="capture-button" onClick={capturePhoto}></button>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );

  //     const videoRef = useRef<HTMLVideoElement | null>(null);
  //     const [isCameraOn, setIsCameraOn] = useState(false);

  //     useEffect(() => {
  //         const initCamera = async () => {
  //         try {
  //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = isCameraOn ? stream : null;
  //         }
  //       } catch (error) {
  //         console.error("Error accessing camera:", error);
  //       }
  //     };

  //     initCamera();

  //     return () => {
  //       // 컴포넌트가 언마운트되면 미디어 스트림 해제
  //       if (videoRef.current && videoRef.current.srcObject) {
  //         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
  //         tracks.forEach((track) => track.stop());
  //       }
  //     };
  //   }, [isCameraOn]);

  //   const toggleCamera = () => {
  //     setIsCameraOn((prevState) => !prevState);
  //   };

  //   return (
  //      <div>
  //        <button onClick={toggleCamera}>{isCameraOn ? "Turn Off Camera" : "Turn On Camera"}</button>
  //        <video ref={videoRef} autoPlay playsInline />
  //      </div>
  //   );
}

export default Camera;
