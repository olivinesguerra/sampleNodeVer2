"use strict";

module.exports = (sequelize, DataTypes) => {
	let Movie = sequelize.define("movie", {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUID, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
		description: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		release_date: { type: DataTypes.DATE, allowNull: true },
		duration: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		rating: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
		// genre_id: { type: DataTypes.UUID, allowNull: true,},
		// movie_id: { type: DataTypes.UUID, allowNull: true },
	}, {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	});
	
	Movie.associate = models => {
		Movie.belongsToMany(models.genre, {
			through: "MovieGenre",
			as: "genres",
			foreignKey: "movie_id"
		});
	};


	Movie.sync({ force: false })
		.then(function (err) { 
			if(err) { 
				console.log("An error occur while creating table"); 
			} else { 
				console.log("Item table created successfully"); 
			} 
		});


	return Movie;
};