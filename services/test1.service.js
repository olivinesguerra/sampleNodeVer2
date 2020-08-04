/* eslint-disable no-mixed-spaces-and-tabs */
"use strict";

const DBSession = require("../models").dbsession;
const uuidv1 = require("uuid");
const { MoleculerClientError } = require("moleculer").Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "test1",

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
				let user = ctx.meta;
				const { session_id } = ctx.params;
				
				try {
					let list = await DBSession.findAll({ where: { session_id: session_id, user_id : user.id  }});	
					return { message: "success",code: 200, data: list[0] };
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

				let session_id = uuidv1();

				try {
					let savedData = await DBSession.create({ 
						session_id, 
						user_id : user.id, 
						data
					});
					return { message: "success",code: 200, data: savedData };
				} catch (e) {
					console.log(e);
				}
			}
		},

		update: {
			params:{
				session_id: { type: "string", min: 1, required: true },
				data: { type: "string", min: 1, required: true },
			},
			async handler(ctx) {
				let user = ctx.meta;
				const { session_id, data } = ctx.params;

				try { 
					let updatedData = await DBSession.update(
					   { 
							user_id: user.id,
							data: data,
						   	updatedAt: new Date()
					   },
					   {  where: {  session_id: session_id }, 
					   returning: true, 
					   raw: true
				   });
   
				   return { message: "success",code: 200, data: updatedData };
			   } catch (e) {
				   console.log(e);
			   }
			}
		},

		remove: {
			params:{
				id: { type: "string", min: 1, required: true },
				session_id: { type: "string", min: 1, required: true },
			},
			async handler(ctx) {
				let user = ctx.meta;
				const { session_id } = ctx.params;

				try { 
					await DBSession.destroy({ where: { session_id: session_id, user_id: user.id }});
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
