// 패키지 모듈 추가
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const pugStatic = require('pug-static');

// 내부 모듈 추가
const { sequelize } = require('./models/index');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const filesRouter = require('./routes/files');

// 서버 설정
const app = express();
// app.set('port', process.env.PORT || 3000);

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

sequelize
    .sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

// 패키지 모듈 라우터 사용 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(pugStatic('#{__dirname}/public/'));
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    })
);

// 라우터 사용 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/files', filesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('./error');
});

app.listen(app.get('port'), function () {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

module.exports = app;
