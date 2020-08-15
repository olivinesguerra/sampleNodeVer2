/* eslint-disable no-mixed-spaces-and-tabs */
"use strict";

const Genre = require("../models").genre;
const Movie = require("../models").movie;
const MovieGenre = require("../models").movie_genre;
const uuidv1 = require("uuid");
const { MoleculerClientError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "genre",
	validator: "Fastest",
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
					let list = await Genre.findAll({  
						limit: limit, 
						offset: skip,
						include: [{
							model: Movie,
							as: "movies",
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
				id: { type: "uuid", min: 1, required: true },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				try {
					let item = await Genre.findOne({ 
						where: { id }, 
						raw: true,
						include: {
							model: Movie,
							as: "movies",
							required: false,
							attributes: ["id", "name", "description"],
							through: {
								model: MovieGenre,
								as: "movieGenre",
								attributes: ["id"],
							}
						}
					});	
					return { message: "success",code: 200, data: item};
				} catch (e) {
					console.log(e);
				}
			}
		},

		insert: {
			params:{
				name: { type: "string", min:1, required: true },
				description: { type: "string", min:1, required: true },
			},
			async handler(ctx) {
				const { name, description } = ctx.params;
				try {
					let id = uuidv1();
					let list = await Genre.findAll({ where: { name }, raw: true});	
					
					if(list.length > 0){
						return new MoleculerClientError("exist", 501, "item-exist", { message: "genre already exist." });
					}

					let savedData = await Genre.create({ name, description, id });
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
					await Genre.destroy({ where: { id }});
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
