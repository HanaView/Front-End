import React from "react";
import "./style.scss";

const ConsultVideo = () => {
  return (
    <div id="consultVideo">
      <div className="connection-options">
        <div className="option">
          <div className="section face">
            <div className="title">텔러</div>
            <img></img>
          </div>
          <div className="section face">
            <div className="title">손님</div>
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
};

export default ConsultVideo;