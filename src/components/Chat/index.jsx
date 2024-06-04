import React, { useState, useEffect } from "react";
import "./style.scss";

function Chat({ dataChannel, messages, setMessages }) {
    const [message, setMessage] = useState(""); // 입력된 메시지 상태
    
    useEffect(() => {
        if (dataChannel) {
          dataChannel.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
          });
        }
      }, [dataChannel, setMessages]);
    
      const handleSendMessage = () => {
        if (dataChannel && message.trim() !== '') {
          dataChannel.send(JSON.stringify({ message: message }));
          setMessage('');
        }
      };
    
      const handleInputChange = (e) => {
        setMessage(e.target.value);
      };

    return (
        <div id="chatDiv">
            <div id="chatContainer"></div>
            <div id="chatInputContainer">
                <input 
                    type="text" 
                    id="chatInput" 
                    placeholder="메시지를 입력하세요" 
                    value={message} 
                    onChange={handleInputChange}
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