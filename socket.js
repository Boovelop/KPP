const chat = require('./sockets/chat');
const cheerMessage = require('./sockets/cheerMessage');
const cookieParser = require('cookie-parser');

function mainSocket(app) {
	const io = app.io;
	io.use((socket, next) => {
		cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
		app.sessionMiddleware(socket.request, socket.request.res, next);
	});

	chat(io);
	cheerMessage(io);
}

module.exports = mainSocket;
