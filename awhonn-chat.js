class AwhonnChatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".awhonn_chatbox__button"),
      chatBox: document.querySelector(".awhonn_chatbox__support"),
      sendButton: document.querySelector(".awhonn_send__button"),
      chatboxHtml: `<div class="awhonn_chatbox">
            <div class="awhonn_chatbox__support">
                <div class="awhonn_chatbox__header">
                    <div class="awhonn_chatbox__image--header">
                        <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="image">
                    </div>
                    <div class="awhonn_chatbox__content--header">
                        <h4 class="awhonn_chatbox__heading--header">Chat support</h4>
                        <p class="awhonn_chatbox__description--header">Hi. My name is Sam. How can I help you?</p>
                    </div>
                </div>
                <div class="awhonn_chatbox__messages">
                    <div></div>
                </div>
                <div class="awhonn_chatbox__footer">
                    <input type="text" placeholder="Write a message...">
                    <button class="awhonn_chatbox__send--footer awhonn_send__button">Send</button>
                </div>
            </div>
            <div class="awhonn_chatbox__button">
                <button><img src="https://cdn.jsdelivr.net/gh/karthik-bics/awhonn-chat/chatbox-icon.svg" /></button>
            </div>
        </div>`,
    };

    this.state = false;
    this.messages = [];
  }

  display() {
    const chatContainer = document.querySelector(".awhonn_chat_container");

    if (chatContainer !== null) {
      chatContainer.innerHTML = this.chatboxHtml;

      const { openButton, chatBox, sendButton } = this.args;

      openButton.addEventListener("click", () => this.toggleState(chatBox));

      sendButton.addEventListener("click", () => this.onSendButton(chatBox));

      const node = chatBox.querySelector("input");
      node.addEventListener("keyup", ({ key }) => {
        if (key === "Enter") {
          this.onSendButton(chatBox);
        }
      });
    }
  }

  toggleState(chatbox) {
    this.state = !this.state;

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("awhonn_chatbox--active");
    } else {
      chatbox.classList.remove("awhonn_chatbox--active");
    }
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Sam", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  updateChatText(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Sam") {
          html +=
            '<div class="awhonn_messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="awhonn_messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });

    const chatmessage = chatbox.querySelector(".awhonn_chatbox__messages");
    chatmessage.innerHTML = html;
  }
}

const chatbox = new AwhonnChatbox();
chatbox.display();
