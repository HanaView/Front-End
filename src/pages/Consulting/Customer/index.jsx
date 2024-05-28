// 손님 화상 상담 화면
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { capturedImageAtom } from "@/stores";
//rcfe

function Consulting() {
  return (
    <div className="Consulting">
      <div className="connection-options">
        <div className="option">
          <div className="section face">
            <div className="title">화상연결</div>
            <img></img>
          </div>
          <div className="section share">
            <div className="title">화면공유</div>
            <img></img>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="video-section">
          <img></img>
        </div>
      </div>
    </div>
  );
}

export default Consulting;
