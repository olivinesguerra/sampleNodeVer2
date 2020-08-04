"use strict";

module.exports = (sequelize, DataTypes) => {
	const OAuthScope = sequelize.define(
		"OAuthScope",
		{
			scope: DataTypes.STRING(80),
			is_default: DataTypes.BOOLEAN
		},
		{
			tableName: "oauth_scopes",
			underscored: true
		}
	);

	OAuthScope.associate = models => {};

	OAuthScope.sync({force: false})
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});

	return OAuthScope;
};
