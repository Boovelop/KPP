const Sequelize = require('sequelize');
const User = require('./user');
const Board = require('./board');
const Comment = require('./comment');
const envConfigs = require('../envConfigs');

// 연결할 데이터베이스 정보
const config = {
  username: envConfigs.database_username,
  password: envConfigs.database_password,
  database: envConfigs.database_name,
  host: envConfigs.database_host,
  port: envConfigs.database_port,
  dialect: 'mysql',
  dialectOptions: {
    useUTC: true, // UTC시간 기준으로 설정한다.
    dateStrings: true, // ! 데이터 로드시 문자열로 가저옴
    typeCast: true, // ! 타임존을 역으로 계산하지 않음
  },
  timezone: '+09:00', // KST시간으로 설정
};
const db = {};
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Board = Board;
db.Comment = Comment;

// 테이블 생성(이미 테이블이 있으면 새로 생성하지 않음)
User.init(sequelize);
Board.init(sequelize);
Comment.init(sequelize);

// 테이블 관계 설정
db.User.hasMany(db.Board, {
  foreignKey: 'author',
  sourceKey: 'user_uniqueName',
});
db.Board.belongsTo(db.User, {
  foreignKey: 'author',
  targetKey: 'user_uniqueName',
});

db.User.hasMany(db.Comment, {
  foreignKey: 'commenter',
  sourceKey: 'user_uniqueName',
});
db.Comment.belongsTo(db.User, {
  foreignKey: 'commenter',
  targetKey: 'user_uniqueName',
});
db.Board.hasMany(db.Comment, { foreignKey: 'boardId', sourceKey: 'id' });
db.Comment.belongsTo(db.User, { foreignKey: 'boardId', targetKey: 'id' });

module.exports = db;
