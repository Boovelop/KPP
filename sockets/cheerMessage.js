function cheerMessageSocket(io) {
    const cheerMessage = io.of('/cheerMessage');

    cheerMessage.on('connection', function (socket) {
        socket.on('send_message', function (message) {
            cheerMessage.emit('receive_message', message);
        });
    });
}

module.exports = cheerMessageSocket;
