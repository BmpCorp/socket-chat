const socket = io();

const introForm = document.getElementById('form-intro');
const nickname = document.getElementById('nickname');

const messageList = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('message');

introForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (nickname.value) {
        socket.emit('authorize', { name: nickname.value });

        document.getElementById('intro').style.display = 'none';
        document.getElementById('chat').style.display = 'block';

        enableChat();
    }
});

function enableChat() {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (input.value) {
            socket.emit('chatMessage', { message: input.value });
            input.value = '';
        }
    });

    socket.on('chatMessage', function ({ message, type, sender }) {
        const item = document.createElement('li');

        if (type === 'system') {
            item.classList.add('system');
        }

        let text;
        if (sender) {
            text = '<b>' + sender + '</b>: ' + message;
        } else {
            text = message;
        }

        item.innerHTML = text;

        messageList.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}
