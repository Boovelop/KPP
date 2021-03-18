const Sequelize = require('sequelize');

// 응원글 DB
module.exports = class CheeringComment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                comment: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                // 중복될 수 있는 유저의 닉네임
                commenter_name: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: true,
                modelName: 'CheeringComment',
                tableName: 'cheering_comments',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
            }
        );
    }
};