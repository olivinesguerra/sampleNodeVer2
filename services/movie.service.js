/* eslint-disable no-mixed-spaces-and-tabs */
"use strict";

const Movie = require("../models").movie;
const MovieGenre = require("../models").movie_genre;
const Genre = require("../models").genre;
const uuidv1 = require("uuid");
const Sequelize = require("sequelize");
const { MoleculerClientError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "movie",

	/**
	 * Settings
	 */
	settings: {
	
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		index: {
			params:{
				skip: { type: "string" , min: 1 },
				limit: { type: "string" , min: 1 },
			},
			async handler(ctx) {
				const { skip, limit } = ctx.params;
				try {
					let list = await Movie.findAll({ 
						limit: limit, 
						offset: skip,
						include: [{
							model: Genre,
							as: "genres",
							required: false,
							attributes: ["id", "name", "description"],
							through: {
								model: MovieGenre,
								as: "movieGenre",
								attributes: ["id"],
							  }
						}]
					});	
					return { message: "success",code: 200, data: list };
				} catch (e) {
					console.log(e);
				}
			}
		},

		show: {
			params:{
				id: { type: "uuid", min: 1, required: false },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				try {
					let list = await Movie.findAll({ 
						where: { id },
						include: [{
							model: Genre,
							as: "genres",
							required: false,
							attributes: ["id", "name", "description"],
							through: {
								model: MovieGenre,
								as: "movieGenre",
								attributes: ["id"],
							  }
						}]
					});	
					return { message: "success",code: 200, data: list[0] };
				} catch (e) {
					console.log(e);
				}
			}
		},

		insert: {
			params:{
				id: { type: "uuid", min: 1, optional: true },
				name: { type: "string", min: 1, optional: false },
				description: { type: "string", min: 1, optional: true },
				release_date: { type: "string", min: 1, optional: true },
				genre: { type: "string", min: 1, optional: true },
				duration: { type: "string", min: 1, optional: false },
				rating: { type: "string", min: 1, optional: false },
			},
			async handler(ctx) {
				const { name, description, release_date, genre, duration, rating, id } = ctx.params;
				try {

					let genreArr = genre.split(",");
					
					for(let i = 0; i < genreArr.length; i++){
						const isExist = await this.checkIfGenreExist(genreArr[i]);
						if(!isExist){
							return new MoleculerClientError("no-exist", 501, "item-no-exist", { message: "genre does'nt exist.", field: "genre", value: genreArr[i] });
						}
					}

					if(id){
						let item = await Movie.findOne({ where: { id }});	
						console.log(item);
						if(item){
							return { message: "success",code: 200, data: item };
						} else {
							return new MoleculerClientError("no-exist", 501, "item-no-exist", { message: "id does'nt exist." });
						}
					}

					let list = await Movie.findAll({ where: { name }});	
					
					if(list.length > 0){
						return new MoleculerClientError("exist", 501, "name-exist", { message: "name exist." });
					} 

					let movieID = uuidv1();
					let savedData = await Movie.create(
						{ 
							name, 
							description, 
							id: movieID, 
							release_date:  Sequelize.literal(`TO_DATE(CAST('${release_date}' AS TEXT), 'YYYY-MM-DD')`),
							genre,
							duration, 
							rating 
						},
					);	

					let temp = [];

					for(let i = 0; i < genreArr.length; i++){
						let movieGenreID = uuidv1();
						await MovieGenre.create({ id: movieGenreID, movie_id: savedData.id, genre_id: genreArr[i]});
						let genre = await ctx.call("genre.show", { id: genreArr[i] });
						temp.push(genre.data);
					}

					let item =  savedData.get({ plain:true });
					item.genres = temp;

					return { message: "success",code: 200, data: savedData };
				} catch (e) {
					console.log(e);
				}
			}
		},

		delete: {
			params:{
				id: { type: "uuid", min: 1, required: true },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				try { 
					await Movie.destroy({ where: { id }});
				    return { message: "success",code: 200, data: {} };
			   } catch (e) {
				   console.log(e);
			   }
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		//Cannot use redis
		async checkIfGenreExist(id){
			let item = await Genre.findOne({ 
				where: { id }, 
				raw: true
			});	
			return item ? true : false;
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
