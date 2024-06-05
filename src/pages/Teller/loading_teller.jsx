import React, { useEffect, useState } from "react";
import "./loading_teller.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

function LoadingTeller() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="LoadingTellerContainer">
        <Button className="titleButton" shape="rect" onClick={() => {}}>
          대기현황판
        </Button>

        <div className="dummy"></div>

        <div className="contentLine">
          <div className="title">현재 대기중인 손님&nbsp;</div>
          <div className="content">7</div>
          <div className="title">명 </div>
        </div>

        <div className="dummy"></div>

        <div className="box">
          <div className="boxLine">
            <div>1.박병철</div>
            <div>예/적금</div>
          </div>
          <div className="boxLine">
            <div>2.강민주</div>
            <div>카드</div>
          </div>
          <div className="boxLine">
            <div>3.김민표</div>
            <div>대출</div>
          </div>
          <div className="boxLine">
            <div>4.김서윤</div>
            <div>전자금융</div>
          </div>
          <div className="boxLine">
            <div>5.유다영</div>
            <div>예/적금</div>
          </div>
          <div className="boxLine">
            <div>6.이고은</div>
            <div>카드</div>
          </div>
          <div className="boxLine">
            <div>7.임탁균</div>
            <div>예/적금</div>
          </div>
        </div>

        <div className="dummy"></div>

        <div className="contentLine">
          <div className="title">오늘의 기준 금리:&nbsp;</div>
          <div className="content">3.5%</div>
        </div>
        <div className="contentLine">
          <div className="title">현재시간:&nbsp;</div>
          <div className="content">{formatTime(time)}</div>
        </div>

        <div className="dummy"></div>

        <Button style={{width:"10%", height:"50px"}} shape="rect" onClick={() => {navigate("/consulting/teller/connecting")}}>
          상담시작
        </Button>
      </div>
    </>
  );
}
export default LoadingTeller;
