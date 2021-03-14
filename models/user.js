const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				login_type: {
					type: Sequelize.STRING(30),
					allowNull: false,
				},
				user_id: {
					type: Sequelize.INTEGER.UNSIGNED,
					allowNull: false,
					unique: true,
				},
				user_name: {
					type: Sequelize.STRING(20),
					allowNull: false,
					unique: true,
				},
				user_email: {
					type: Sequelize.STRING(50),
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

	static associate(db) {
		// db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
	}
};
