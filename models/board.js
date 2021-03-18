const Sequelize = require('sequelize');

// 게시판 DB
module.exports = class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                // 글 제목
                title: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                text: {
                    type: Sequelize.TEXT(),
                    allowNull: false,
                },
                image_files: {
                    type: Sequelize.TEXT(),
                },
                // 글 작성자(닉네임 중복 가능)
                author: {
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
                modelName: 'Board',
                tableName: 'boards',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
            }
        );
    }
};
