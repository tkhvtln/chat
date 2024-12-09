document.addEventListener("DOMContentLoaded", function () {
    const ws = new WebSocket("ws://localhost:8080/ws");

    const chatContainer = document.getElementById("chat-container");
    const nameContainer = document.getElementById("name-container");
    const chat = document.getElementById("chat");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");
    const usernameInput = document.getElementById("username");
    const enterChatButton = document.getElementById("enter-chat");

    let username = "";

    enterChatButton.addEventListener("click", function () {
        username = usernameInput.value.trim();
        if (!username) {
            alert("Username cannot be empty");
            return;
        }
        nameContainer.style.display = "none"; 
        chatContainer.style.display = "flex"; 
        usernameInput.disabled = true; 
        enterChatButton.disabled = true; 
    });

    ws.onmessage = function(event) {
        const msg = JSON.parse(event.data);
        const messageElement = document.createElement("div");
    
        const usernameElement = document.createElement("strong");
        usernameElement.textContent = msg.username;
    
        const messageContentElement = document.createElement("span");
        messageContentElement.textContent = msg.content;
    
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(messageContentElement);
    
        if (msg.username === usernameInput.value.trim()) {
            messageElement.classList.add("user-message");
        } else {
            messageElement.classList.add("other-message");
        }
    
        chat.appendChild(messageElement);
    };
    
    

    sendButton.addEventListener("click", function () {
        const message = messageInput.value.trim();
        if (!message) {
            alert("Message cannot be empty");
            return;
        }
        const msg = {
            username: username,
            content: message,
        };
        ws.send(JSON.stringify(msg));
        messageInput.value = "";
    });
});


