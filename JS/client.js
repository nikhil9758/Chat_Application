const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')
let messageid=0;

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    var btn= document.createElement("BUTTON");
    messageElement.id=socket.id+messageid;
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position)
    messageContainer.append(messageElement);

    var btnRemove = document.createElement("INPUT");
    btnRemove.value = "Remove";
    btnRemove.type = "button";
    btnRemove.classList.add('button');
    btnRemove.onclick = function (event) {
        console.log(event);
        console.log(event.target.parentElement.id);
        socket.emit('delete-msg',event.target.parentElement.id);
        messageElement.remove(this.parentNode);
    };

    messageElement.appendChild(btnRemove);

 }


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    messageid= messageid+1;
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', {msg:message,id:messageid});
    messageInput.value = '';
})

const name = prompt("Enter your name to join LetsChat")
socket.emit('new-user-joined', name)

socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right');
})

socket.on('receive', data=>{
    append(`${data.name }: ${data.message}`, 'left')
})

socket.on('left', name=>{
    append(`${name } left the chat`, 'left');
})