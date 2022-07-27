// 패키지 모듈 추가
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const pugStatic = require('pug-static');
const passport = require('passport');
const ColorHash = require('color-hash');

// 환경변수 설정
switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config({ path: path.join(__dirname, 'production.env') });
    break;
  case 'development':
    dotenv.config({ path: path.join(__dirname, 'development.env') });
    break;
  default:
    console.error('환경변수 파일을 찾을 수 없습니다. 종료 합니다.');
    process.exit(1);
}

const envConfigs = require('./envConfigs');

// 내부 모듈 추가
const { sequelize } = require('./models/index');
const socket = require('./socket');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const filesRouter = require('./routes/files');
const boardRouter = require('./routes/board');
const commentRouter = require('./routes/comment');

// 서버 설정
const app = express();

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(err => {
    console.error(err);
  });

// 패키지 모듈 라우터 사용 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(pugStatic('#{__dirname}/public/'));

app.sessionMiddleware = session({
  secret: envConfigs.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
});
app.use(app.sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

// 라우터 사용 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/files', filesRouter);
app.use('/board', boardRouter);
app.use('/commnet', commentRouter);

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

app.io = require('socket.io')();

socket(app);

module.exports = app;
