function chatSocket(io) {
	const chat = io.of('/chat');

	chat.on('connection', function (socket) {
		const req = socket.request;
		socket.on('send_message', function (data) {
			chat.emit('receive_message', { name: data.name, message: data.message, userColor: req.session.color });
		});
	});
}

module.exports = chatSocket;
