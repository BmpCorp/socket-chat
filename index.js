const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const ioServer = new Server(httpServer);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});
app.use('/assets', express.static('assets'));

const clients = {};

ioServer.on('connection', (socket) => {
    console.log('user connected');
    clients[socket.id] = {
        authorized: false,
    };

    socket.on('authorize', ({ name }) => {
        clients[socket.id].authorized = true;
        clients[socket.id].name = name;

        ioServer.emit('chatMessage', {
            type: 'system',
            message: name + ' присоединился к чату',
        });
    });

    socket.on('chatMessage', ({ message }) => {
        if (!clients[socket.id].authorized) {
            return;
        }

        ioServer.emit('chatMessage', {
            message,
            sender: clients[socket.id].name,
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (!clients[socket.id].authorized) {
            return;
        }

        ioServer.emit('chatMessage', {
            type: 'system',
            message: clients[socket.id].name + ' покинул чат',
        });

        delete clients[socket.id];
    });
});

httpServer.listen(3000, () => {
    console.log('listening on port 3000');
});
