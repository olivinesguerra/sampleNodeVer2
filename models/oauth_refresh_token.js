"use strict";

module.exports = (sequelize, DataTypes) => {
	const OAuthRefreshToken = sequelize.define(
		"OAuthRefreshToken",
		{
			refresh_token: DataTypes.STRING(256),
			expires: DataTypes.DATE,
			scope: DataTypes.STRING,
			client_id: DataTypes.STRING(80),
			user_id: DataTypes.UUID
		},
		{
			tableName: "oauth_refresh_tokens",
			underscored: true
		}
	);

	// OAuthRefreshToken.associate = models => {
	//   models.OAuthAccessToken.belongsTo(models.OAuthClient, {
	//     foreignKey: 'client_id'
	//   });

	//   models.OAuthAccessToken.belongsTo(models.user, {
	//     foreignKey: 'user_id'
	//   });
	// };


	OAuthRefreshToken.sync({force: false})
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});

	return OAuthRefreshToken;
};
