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
                // 게시판에 사용한 이미지 파일들
                image_files: {
                    type: Sequelize.TEXT(),
                },
                // 글 작성자(닉네임 중복 가능)
                author_name: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                },
                // 조회수
                views: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
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
