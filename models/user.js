const Sequelize = require('sequelize');

// 유저 DB
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                login_type: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
                user_id: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    unique: true,
                },
                user_name: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                },
                user_email: {
                    type: Sequelize.STRING(100),
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: true,
                modelName: 'User',
                tableName: 'users',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
            }
        );
    }
};