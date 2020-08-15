/* eslint-disable no-mixed-spaces-and-tabs */
"use strict";

module.exports = (sequelize, DataTypes) => {
	let MovieGenre = sequelize.define("movie_genre", {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUID, allowNull: false },
		movie_id: { type: DataTypes.UUID, allowNull: false },
		genre_id: { type: DataTypes.UUID, allowNull: true },
	}, {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	});

	MovieGenre.sync({ force: false })
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});


	return MovieGenre;
};
