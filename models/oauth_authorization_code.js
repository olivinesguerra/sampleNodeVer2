"use strict";

module.exports = (sequelize, DataTypes) => {
	const OAuthAuthorizationCode = sequelize.define(
		"OAuthAuthorizationCode",
		{
			id: {
				type: DataTypes.INTEGER(14),
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			authorization_code: DataTypes.STRING(256),
			expires: DataTypes.DATE,
			redirect_uri: DataTypes.STRING(2000),
			scope: DataTypes.STRING,
			client_id: DataTypes.STRING(80),
			user_id: DataTypes.UUID
		},
		{
			tableName: "oauth_authorization_codes",
			underscored: true
		}
	);

	// OAuthAuthorizationCode.associate = models => {
	//   console.log(models);
	//   models.OAuthAccessToken.belongsTo(models.OAuthClient, {
	//     foreignKey: 'client_id'
	//   });

	//   models.OAuthAccessToken.belongsTo(models.user, {
	//     foreignKey: 'user_id'
	//   });
	// };

	OAuthAuthorizationCode.sync({force: false})
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});

	return OAuthAuthorizationCode;
};
