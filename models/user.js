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
				// 글 작성자에 사용할 id + name의 합성 데이터
				// 유저 데이터 수정시 다른 DB의 관계에 의해 자동 수정되게끔 설계
				user_uniqueName: {
					type: Sequelize.STRING(100),
					allowNull: false,
					unique: true,
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
				onDelete: 'CASCADE',
			}
		);
	}
};
