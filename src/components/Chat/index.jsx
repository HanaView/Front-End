import React, { useState, useEffect } from "react";
import "./style.scss";

function Chat() {

    return (
        <div id="chatDiv">
            <div id="chatContainer"></div>
            <div id="chatInputContainer">
                <input type="text" id="chatInput" placeholder="메시지를 입력하세요" />
                <img
                    className="callBtn"
                    src="/src/assets/images/sendChat.png"
                    
                    alt="Send"
                />
            </div>
        </div>
    );
}

export default Chat;