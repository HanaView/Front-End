import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./camera.scss";
import { useAtom } from "jotai";
import { capturedImageAtom } from "@/stores";
import axios from "axios";
function Camera() {
  const [capturedImage, setCapturedImage] = useAtom(capturedImageAtom);
  const [file, setFile] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          //video: true // 전면카메라

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

  // const capturePhoto = () => {
  //   const canvas = canvasRef.current;
  //   const video = videoRef.current;
  //   const context = canvas.getContext("2d");
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //   const dataURL = canvas.toDataURL("image/png");
  //   console.log(dataURL);
  //   // @ts-ignore
  //   setCapturedImage(dataURL); // 사진 저장
  //   navigate("/auth"); // 사진출력 페이지로 이동
  // };

  const captureAndUpload = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);

    // @ts-ignore
    setCapturedImage(dataURL); // 사진 저장

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "captured_image.png");
      console.log("###");
      console.log(formData);
      try {
        const response = await axios.post(
          "http://localhost:80/api/login/ocr",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        // @@@@
        console.log(response.data);

        // 응답 데이터를 localStorage에 저장
        localStorage.setItem("ocrData", JSON.stringify(response.data));

        // 사진출력 페이지로 이동
        navigate("/auth"); 
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
      }
    }, "image/png");
  };

  return (
    <div className="camera-container">
      <p className="text-container">신분증 인증</p>
      <div className="camera-preview">
        <video ref={videoRef} autoPlay playsInline></video>
        <div className="overlay"></div>
      </div>
      <p className="text-container">
        영역 안에 신분증이 꽉 차도록 배치 후 <br />
        하단 버튼을 누르면 촬영됩니다.
      </p>
      <button className="capture-button" onClick={captureAndUpload}></button>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default Camera;
