// Connect to the socket server
const socket = io("http://localhost:3000");

const body = document.querySelector(".container");
const chatBox = document.getElementById("chatBox");
const messageContainer = document.getElementById("chatting");
const form = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const concurrentUsers = document.createElement("div");
concurrentUsers.id = "concurrentUsers";
body.prepend(concurrentUsers); //


socket.on('connect', () => {
  const name = prompt("Enter your name to join");


  if (name && name.trim() !== "") {

    socket.emit("userJoined", name);
  } else {
    alert("Name is required to join the chat");
    window.location.reload();
  }
});


socket.on("disconnected", (data) => {
  userJoinUiUpdate(`${data.name} left the chat`, "center");
  socket.emit('getUserCount'); // 
});


socket.on("user-joined", (data) => {
  userJoinUiUpdate(`${data.name} joined the chat`, "center");
  socket.emit('getUserCount'); // 
});

socket.on("updateUserCount", (count) => {
  concurrentUsers.innerText = `Users online: ${count}`;
});

socket.on("receive", (data) => {
  messageUiUpdate(data.message, data.name, "left", data.id);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message === "") return;

  const id = Math.round(Math.random() * 100000);
  messageUiUpdate(message, "You", "right", id);
  socket.emit("send", { message, id });
  messageInput.value = "";
});


const userJoinUiUpdate = (message, position) => {
  const messageUi = document.createElement("div");
  const pElement = document.createElement("p");
  pElement.innerText = message;
  messageUi.classList.add("message", position);
  messageUi.append(pElement);
  messageContainer.append(messageUi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};


const messageUiUpdate = (message, user, position, id) => {
  const messageUi = document.createElement("div");
  const span = document.createElement("span");
  const p = document.createElement("p");

  span.innerText = user;
  p.innerText = message;
  messageUi.append(span, p);

  messageUi.classList.add(position, "message");
  messageUi.setAttribute("id", id);
  messageContainer.append(messageUi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};
