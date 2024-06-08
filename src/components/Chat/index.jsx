import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

function Chat({ dataChannel, messages, onMessageReceived }) {
  const [message, setMessage] = useState(""); // 입력된 메시지 상태
  const chatContainerRef = useRef(null); // 채팅 컨테이너에 대한 Ref

  // const scrollToBottom = () => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //   }
  // };

  // useEffect(() => {
  //   scrollToBottom(); // 메시지가 업데이트될 때마다 스크롤을 아래로 내림
  // }, [messages]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (dataChannel === null || dataChannel.readyState !== "open") {
      alert("상대방과 연결되지 않았습니다!");
      return;
    }

    if (dataChannel && message.trim() !== "") {
      const timestamp = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      const messageObject = { message, timestamp };
      dataChannel.send(JSON.stringify(messageObject)); // 메시지를 JSON으로 전송
      onMessageReceived({ sender: "local", message, timestamp });
      setMessage("");
      console.log(messages);

      // scrollToBottom();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div id="chatDiv">
      <div id="chatContainer">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "local" ? "mine" : "remote"}`}
          >
            {msg.sender === "local" ? (
              <>
                <div className="timestamp">{msg.timestamp}</div>
                <div className="bubble">{msg.message}</div>
              </>
            ) : (
              <>
                <div className="bubble">{msg.message}</div>
                <div className="timestamp">{msg.timestamp}</div>
              </>
            )}
          </div>
        ))}
      </div>
      <div id="chatInputContainer">
        <input
          type="text"
          id="chatInput"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <img
          className="callBtn"
          src="/src/assets/images/sendChat.png"
          onClick={
            handleSendMessage}
          alt="Send"
        />
      </div>
    </div>
  );
}

export default Chat;
