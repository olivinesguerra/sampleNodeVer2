"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { MoleculerClientError } = require("moleculer").Errors;
const axios = require("axios");
const uuidv1 = require("uuid");
const qs = require("qs");

const mockAPI = "https://5f28ad11f5d27e001612f191.mockapi.io/sessions";

module.exports = {
	name: "test2",

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
				session_id: { type: "string", min: 1, required: true }, 
			},
			async handler(ctx) {
				const { session_id } = ctx.params;

				try {
					let res = await axios.get(`${mockAPI}/${session_id}`);
					return { message: "success",code: 200, data: res.data };
				} catch (e) {
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

				let sessionID = uuidv1();

				try {
					let res = await axios.post(`${mockAPI}`, 
						qs.stringify({
							session_id: sessionID,
							user_id: user.id,
							data: data
						}));

					return { message: "success",code: 200, data: res.data };
				} catch (e) {
					console.log(e);
				}
			}
		},

		update: {
			params:{
				data: { type: "string", min:1, required: true }, 
				session_id: { type: "string", min: 1, required: true }, 
			},
			async handler(ctx) {
				let user = ctx.meta;
				const { data, session_id } = ctx.params;

				try {

					let res = await axios.put(`${mockAPI}/${session_id}`, 
						qs.stringify({
							user_id: user.id,
							data: data
						}));

					return { message: "success",code: 200, data: res.data };
				} catch (e) {
					console.log(e);
				}
			}
		},

		remove: {
			params:{
				session_id: { type: "string", min:1, required: true }, 
			},
			async handler(ctx) {
				const { session_id } = ctx.params;

				try {
					await axios.delete(`${mockAPI}/${session_id}`);
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
