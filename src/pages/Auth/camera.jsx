import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./camera.scss";
import { useAtom } from "jotai";
import { capturedImageAtom } from "@/stores";
import axios from "axios";
import imageCompression from "browser-image-compression"; // 이미지 압축 라이브러리

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
          video: {
            facingMode: { exact: "environment" }, // 후면 카메라 사용 설정
            // facingMode: "user", // 전면 카메라 사용 설정
            width: { ideal: 518 }, // 원하는 해상도를 설정
            height: { ideal: 320 } // 원하는 해상도를 설정
          }
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    getCameraStream();
  }, []);

  const captureAndUpload = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");    

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, 518, 320);

    const dataURL = canvas.toDataURL("image/jpg");
    console.log(dataURL);

    // @ts-ignore
    setCapturedImage(dataURL); // 사진 저장

    canvas.toBlob(async (blob) => {
      // // 이미지 압축 옵션 설정
      // const options = {
      //   maxSizeMB: 1, // 최대 파일 크기 (MB 단위)
      //   maxWidthOrHeight: 1280, // 최대 너비 또는 높이
      //   useWebWorker: true // 웹 워커 사용 (성능 향상)
      // };

      // // 이미지 압축
      // const compressedBlob = await imageCompression(blob, options);

      const formData = new FormData();
      formData.append("file", blob, "captured_image.jpg");
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
    }, "image/jpg");
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
