var loc = window.location;
var wsStart = loc.protocol === "https:" ? "wss://" : "ws://";
var ws = new WebSocket(wsStart + loc.host + "/ws");

ws.onopen = function () {
  console.log("connection established");
};

var botResponse = "";
var currentActiveBotDiv = "bot-active-bubble";

ws.onmessage = function (event) {
  var chatHistory = document.getElementById("chat-history");

  if (event.data === "[END]") {
    var messageDiv = document.getElementById(currentActiveBotDiv);
    messageDiv.id = "";
    botResponse = "";
    return;
  }
  if (event.data === "[CLS-RSP]") {
    clearChatHistory();
    return;
  }
  botResponse += event.data;
  var messageDiv = document.getElementById(currentActiveBotDiv);
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = currentActiveBotDiv;
    messageDiv.className = "message bot-message";
    messageDiv.innerHTML = `<md-block class="mdblock"></md-block>`;
    chatHistory.appendChild(messageDiv);
  }

  messageDiv.querySelector(".mdblock").mdContent = botResponse;
  chatHistory.scrollTop = chatHistory.scrollHeight;
};

ws.onclose = function () {
  console.log("connection closed");
};

document.getElementById("send-button").onclick = function () {
  sendMessage();
};

document.getElementById("content").onkeypress = function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

document.getElementById("clear-button").onclick = function () {
  ws.send("[CLS-REQ]");
};

function sendMessage() {
  var content = document.getElementById("content").value;
  if (!content.trim()) {
    return;
  }
  var chatHistory = document.getElementById("chat-history");
  var messageHtml = `<div class="message user-message"><md-block class="text">${content}</md-block></div>`;
  chatHistory.innerHTML += messageHtml;
  chatHistory.scrollTop = chatHistory.scrollHeight;
  ws.send(content);
  document.getElementById("content").value = "";
}

function clearChatHistory() {
  var chatHistory = document.getElementById("chat-history");

  setTimeout(function () {
    chatHistory.innerHTML = "";
  }, 100);

  // Apply gray background
  chatHistory.classList.add("gray-background");

  // Remove the gray background after 0.5 seconds
  setTimeout(function () {
    chatHistory.classList.remove("gray-background");
  }, 200);
}

function handleTitleClick() {
  console.log("Title clicked!");
  // var mdElement = document.getElementById("markdownTest");
  // mdElement.mdContent = "## New con";
}
