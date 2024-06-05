import React, { useState, useEffect } from "react";
import "./style.scss";

function Chat({ dataChannel, messages, onMessageReceived }) {
  const [message, setMessage] = useState(""); // 입력된 메시지 상태

  useEffect(() => {
    if (dataChannel) {
      console.log(
        "데이터 채널을 사용할 수 있습니다. 메시지 이벤트 리스너를 추가합니다."
      );
      const handleMessage = (event) => {
        const receivedMessage = event.data;
        if (receivedMessage) {
          console.log("새 메시지를 수신했습니다:", receivedMessage);
          onMessageReceived({
            sender: "Remote",
            message: receivedMessage.message
          });
        }
      };
      dataChannel.addEventListener("message", handleMessage);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        console.log(
          "컴포넌트가 언마운트되었습니다. 메시지 이벤트 리스너를 제거합니다."
        );
        dataChannel.removeEventListener("message", handleMessage);
      };
    }
  }, [dataChannel]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (dataChannel === null || dataChannel.readyState !== "open") {
      alert("상대방과 연결되지 않았습니다!");
      return;
    }

    if (dataChannel && message.trim() !== "") {
      const messageObject = { message };
      dataChannel.send(message);
      dataChannel.send(JSON.stringify(messageObject)); // 메시지를 JSON 형식으로 전송
      onMessageReceived({ sender: "나", message });
      setMessage("");
      console.log(messages);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div id="chatDiv">
      <div id="chatContainer">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.sender}: {msg.message}
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
          onClick={handleSendMessage}
          alt="Send"
        />
      </div>
    </div>
  );
}

export default Chat;
