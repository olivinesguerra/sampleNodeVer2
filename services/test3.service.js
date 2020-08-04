"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const uuidv1 = require("uuid");
const fs = require("fs");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */


module.exports = {
	name: "test3",

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
		get: {
			params:{
				session_id: { type: "string", min:1, required: true },
			},
			async handler(ctx) {
				const { session_id } = ctx.params;

				try {
					let rawdata = await fs.readFileSync(`../uploads/${session_id}.json`);
					let data = JSON.parse(rawdata);
					return { message: "success",code: 200, data: data };
				} catch (e){
					console.log(e);
				}
			}
		},

		create: {
			params:{
				data: { type: "string", min:1, required: true },
			},
			async handler(ctx) {
				let user = ctx.meta;
				const { data } = ctx.params;

				let session_id = uuidv1();

				let raw = { 
					session_id, 
					user_id : user.id, 
					data
				};

				try {
					let dataWrite = JSON.stringify(raw);
					await fs.writeFileSync(`../uploads/${session_id}.json`, dataWrite);
	
					return { message: "success",code: 200, data: raw };
				} catch (e){
					console.log(e);
				}
			}
		},

		update: {
			params:{
				session_id: { type: "string", min:1, required: true },
				data: { type: "string", min: 1, required: true },
			},
			async handler(ctx) {
				let user = ctx.meta;
				const { data, session_id } = ctx.params;

				let raw = { 
					session_id, 
					user_id : user.id, 
					data
				};

				try {
					let dataWrite = JSON.stringify(raw);
					await fs.writeFileSync(`../uploads/${session_id}.json`, dataWrite);
	
					return { message: "success",code: 200, data: raw };
				} catch (e){
					console.log(e);
				}
			}
		},

		remove: {
			params:{
				id: { type: "string", min: 1, required: true },
			},
			async handler(ctx) {
				let user = ctx.meta;
				const {  session_id } = ctx.params;


				try {
					await fs.unlink(`../uploads/${session_id}.json`);
					return { message: "success",code: 200, data: {} };
				} catch (e){
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
