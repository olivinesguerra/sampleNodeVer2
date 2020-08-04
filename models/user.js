"use strict";

module.exports = (sequelize, DataTypes) => {
	let User = sequelize.define("user", {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUID, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
		password: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
		token: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		is_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
		vcode: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		image_url: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		type: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
		address: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		social_id: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		push_id: { type: DataTypes.STRING, allowNull: true, defaultValue: "" }
	}, {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	});

	User.sync({ force: false })
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});


	return User;
};
