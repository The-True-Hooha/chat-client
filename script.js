let socket;
function connectToChat() {
  const jwtToken = document.getElementById("jwtToken").value;
  console.log(jwtToken);
  if (!jwtToken) {
    alert("Please enter JWT Token");
    return;
  }

  socket = io("ws://localhost:3000/chat-support", {
    auth: {
      token: `Bearer ${jwtToken}`,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to chat");
    window.alert("Connected to chat");
  });

  socket.on("start", (data) => {
    appendMessage(data.message);
    console.log(data);
  });

  socket.on("new-message", (event) => {
    const messageContainer = document.getElementById("messages");
    // const message = JSON.parse(event.data);
    const { from, content, timeStamp } = event;
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `
          <span class="username">${from}</span>
          <span class="content">${content}</span>
          <span class="timestamp">${timeStamp}</span>
        `;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  });

  let joinUserSent = false
  socket.on("adminJoined", (data) => {
    appendMessage(data.message, data.timeStamp);
    if (!joinUserSent) {
      socket.emit("join-user", { userProfileId: data.roomId });
      // appendMessage(`the room id:: ${getRoomId}`);
      joinUserSent = true
      console.log("joined the room");
    }
    console.log(data);
  });

  socket.on("offline", (data) => {
    appendMessage(data.message);
    console.log(data);
  });

  socket.on("online", (data) => {
    appendMessage(data.message);
    console.log(data);
  });
}

function appendMessage(message) {
  const messagesDiv = document.getElementById("messages");
  const p = document.createElement("p");
  p.textContent = message;
  messagesDiv.appendChild(p);
}

function sendMessage() {
  const message = document.getElementById("message").value;
  appendMessage(message);
  const getRoomId = document.getElementById("roomId").value;
  if (!message) {
    alert("Please enter a message");
    return;
  }
  if (!socket || socket.connected !== true) {
    alert("Not connected to chat");
    return;
  }
  socket.emit("message", { message: message, roomId: getRoomId });
  document.getElementById("message").value = "";
}

function JoinRoom() {
  const getRoomId = document.getElementById("roomId").value;
  console.log(getRoomId);
  const aID = "5ed1a542-9d7e-4e49-9f2c-5372b9343e39"
  socket.emit("join-chat", { userProfileId: getRoomId, adminId: aID });
  // appendMessage(`the room id:: ${getRoomId}`);
}
