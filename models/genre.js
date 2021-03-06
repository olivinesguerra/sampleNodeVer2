/* eslint-disable no-mixed-spaces-and-tabs */
"use strict";

module.exports = (sequelize, DataTypes) => {
	let Genre = sequelize.define("genre", {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUID, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
		description: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
	}, {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	});

	Genre.associate = models => {
		Genre.belongsToMany(models.movie, {
			through: "MovieGenre",
			as: "movies",
			foreignKey: "genre_id",
		  });
	};

	Genre.sync({ force: false })
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});


	return Genre;
};
