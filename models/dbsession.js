"use strict";

module.exports = (sequelize, DataTypes) => {
	let dbsession = sequelize.define("dbsession", {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUID, allowNull: false },
		session_id: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
		user_id: { type: DataTypes.UUID, allowNull: true, defaultValue: null },
		data: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
	}, {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	});

	dbsession.sync({ force: false })
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});


	return dbsession;
};
