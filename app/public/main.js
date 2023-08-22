const socket = io()

const totalClients = document.getElementById("clients-total");

const messagesContainer = document.getElementById("messages-container");


const inputName = document.getElementById('input-name');

const messageForm = document.getElementById('message-form');

const inputMessage = document.getElementById('message-input');

const messageTone = new Audio('./message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); // to prevent reloading the page 
    sendMessage();
})




socket.on('clients-total', (data) => {
    totalClients.innerText = data;
})


function sendMessage() {
    const data = {
        name: inputName.value,
        message: inputMessage.value,
        dateTime: new Date()
    }
    socket.emit('message', data);
    addMessageToUI(true, data);
    inputMessage.value = '';
}


socket.on('chat-message', (data) => {
    messageTone.play();
    addMessageToUI(false, data);
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = isOwnMessage ? `
        <div class="left-message">
            <div class="left-image">
                <img src="img.png" alt="">
            </div>
            <div class="message-data">
                <div class="message-header">
                    <span>${data.name}</span>
                </div>
                <div class="left-message-body">
                    ${data.message}
                </div>
                <div>                    
                ${moment(data.dateTime).calendar()}
                </div>
            </div>
        </div>
        ` :
        `
        <div class="right-message">
                <div class="message-data">
                    <div class="message-header">
                        <span>${data.name}</span>
                    </div>
                    <div class="right-message-body">
                        ${data.message}
                    </div>
                    <div>
                    ${moment(data.dateTime).calendar()}
                    </div>
                </div>
                <div class="right-image">
                    <img src="img.png" alt="">
                </div>
            </div>`;
    messagesContainer.innerHTML += element;
}

inputMessage.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${inputName.value} is typing a message...`
    })
})


inputMessage.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
})


socket.on('feedback', (data) => {
    clearFeedback();
    const div = `<div class="typing">${data.feedback}</div>`
    messagesContainer.innerHTML += div;
})

function clearFeedback() {
    document.querySelectorAll('.typing').forEach(element => {
        element.remove();
    })
}