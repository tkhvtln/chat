document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket("ws://localhost:8080/ws");

    const chat = document.getElementById("chat");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");
    const usernameInput = document.getElementById("username");

    ws.onmessage = function(event) {
        const msg = JSON.parse(event.data);
        const messageElement = document.createElement("div");
        messageElement.textContent = `${msg.username}: ${msg.content}`;
        chat.appendChild(messageElement);
    };

    sendButton.addEventListener("click", function() {
        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();
        if (!username || !message) {
            alert("Username and message cannot be empty");
            return;
        }
        const msg = {
            username: username,
            content: message
        };
        ws.send(JSON.stringify(msg));
        messageInput.value = "";
    });
});
