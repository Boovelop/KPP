const Sequelize = require('sequelize');

// 연결할 데이터베이스 정보
const config = process.env.NODE_ENV || {
    username: 'root',
    password: null,
    database: 'kpp',
    host: '127.0.0.1',
    dialect: 'mysql',
};
const db = {};
let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
