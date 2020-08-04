"use strict";


module.exports = (sequelize, DataTypes) => {
	const OAuthAccessToken = sequelize.define(
		"OAuthAccessToken",
		{
			id: {
				type: DataTypes.INTEGER(14),
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			access_token: DataTypes.STRING(256),
			expires: DataTypes.DATE,
			scope: DataTypes.STRING,
			client_id: DataTypes.STRING(80),
			user_id: DataTypes.UUID
		},
		{
			tableName: "oauth_access_tokens",
			underscored: true
		}
	);
	// OAuthAccessToken.associate = models => {
	//   models.OAuthAccessToken.belongsTo(models.OAuthClient, {
	//     foreignKey: 'client_id'
	//   });

	//   models.OAuthAccessToken.belongsTo(models.user, {
	//     foreignKey: 'user_id'
	//   });
	// };

	OAuthAccessToken.sync({force: false})
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});

	return OAuthAccessToken;
};
