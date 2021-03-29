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
// const SocketIO = require('socket.io');
// const cookieParser = require('cookie-parser');

// module.exports = function (server, app, sessionMiddleware) {
//     const io = SocketIO(server, { path: '/socket.io' });

//     app.set('io', io);

//     const chat = io.of('/community');

//     io.use(function (socket, next) {
//         cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
//         sessionMiddleware(socket.request, socket.request.res, next);
//     });

//     io.on('connection', function (socket) {
//         console.log('소켓에 접속했다');
//     });

//     io.on('disconnect', function (socket) {
//         console.log('소켓 접속을 해제했다');
//     });
// };

// https://velog.io/@imkj1/node-express-socket
