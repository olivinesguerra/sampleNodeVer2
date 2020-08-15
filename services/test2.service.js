/* eslint-disable no-mixed-spaces-and-tabs */
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
			// params:{
			// 	session_id: { type: "string", min: 1, required: true }, 
			// },
			async handler(ctx) {
				const { session_id } = ctx.params;

				try {
					let res = await axios.get(`${mockAPI}/${session_id}`);
					return { message: "success",code: 200, data: res.data };
				} catch (e) {
					console.log(e);
				}

				// try {
				// 	let res = await axios.get(`https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json`);
				// 	let processedData = await this.getSumOfChatWithDateRange(res.data , new Date(2019, 2, 1), new Date(2019, 3, 1));
				// } catch (e) {
				// 	console.log(e);
				// }
			}
		},

		create: {
			params:{
				data: { type: "string", min:1, required: true }, 
			},
			async handler(ctx) {
				let user = ctx.meta;
				const { data } = ctx.params;

				// let sessionID = uuidv1();

				// try {
				// 	let res = await axios.post(`${mockAPI}`, 
				// 		qs.stringify({
				// 			session_id: sessionID,
				// 			user_id: user.id,
				// 			data: data
				// 		}));

				// 	return { message: "success",code: 200, data: res.data };
				// } catch (e) {
				// 	console.log(e);
				// }
			}
		},

		update: {
			params:{
				data: { type: "string", min:1, required: true }, 
				session_id: { type: "string", min: 1, required: true }, 
			},
			async handler(ctx) {
				let user = ctx.meta;
				// const { data, session_id } = ctx.params;

				// try {

				// 	let res = await axios.put(`${mockAPI}/${session_id}`, 
				// 		qs.stringify({
				// 			user_id: user.id,
				// 			data: data
				// 		}));

				// 	return { message: "success",code: 200, data: res.data };
				// } catch (e) {
				// 	console.log(e);
				// }
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
		// async formArray(arr, orig, largestNumber) {

		// 	for(let i = 0; i < arr.length * arr.length; i++){
		// 		let joinedArr = arr.join("");
		// 		console.log(joinedArr);

		// 		if(largestNumber !== null){
		// 			largestNumber = parseInt(joinedArr);
		// 		} else {
		// 			if(parseInt(joinedArr) > largestNumber){
		// 				largestNumber = parseInt(joinedArr);
		// 			}
		// 		}

		// 		for(let j = 0; j < arr.length; j++){
		// 			let tempVal = arr[i];
		// 		}

		// 	}

		// 	console.log(`largest combination:${largestNumber}`);
		// },

		// async permutation(input, usedChars, permArr) {
		// 	let i, ch;
		// 	for (i = 0; i < input.length; i++) {
		// 	  ch = input.splice(i, 1)[0];
		// 	  console.log(ch);
		// 	  usedChars.push(ch);

		// 	  if (input.length == 0) {
		// 			permArr.push(usedChars.slice());
		// 	  }

		// 	  await this.permutation(input, usedChars, permArr);
		// 	  input.splice(i, 0, ch);
		// 	  usedChars.pop();
		// 	}
		// 	return permArr;
		// },
		// async formArray(arr, usedChars, permArr) {
		// 	let finalPerm = await this.permutation(arr, usedChars, permArr);
		// 	console.log(finalPerm);	

		// 	let largestvalue = null;

		// 	for(let i = 0; i < finalPerm.length; i++){
		// 		let joinedArr = finalPerm[i].join("");

		// 		if(largestvalue === null){
		// 			largestvalue = parseInt(joinedArr);
		// 		} else if (parseInt(joinedArr) > largestvalue){
		// 			largestvalue = parseInt(joinedArr);
		// 		}
		// 	}

		// 	console.log(`largest value: ${largestvalue}`);
		// }

		// async getSumOfChatWithDateRange(data = [], startDate = null, endDate = null){

		// 	if(data.length === 0) return [];
		// 	if(new Date(startDate) > new Date(endDate)) return [];
			
			
		// 	let newArray = [];
		// 	let filterWithDate = true;

		// 	if(startDate === null){
		// 		filterWithDate = false;
		// 	}

		// 	let currentWebsite = null;
		// 	let chats = 0;
		// 	let missedChats = 0;

		// 	for(let i = 0; i < data.length; i++){
		// 		if(filterWithDate){
		// 			if(!(new Date(this.getFormattedDate(new Date(data[i].date))).getTime() >= startDate.getTime() && new Date(this.getFormattedDate(new Date(data[i].date))).getTime() <= endDate.getTime())){
		// 				continue;
		// 			}
		// 		}
		// 		if(currentWebsite === null){
		// 			currentWebsite = data[i].websiteId;
		// 		} else if (currentWebsite != data[i].websiteId) {
		// 			newArray.push({ websiteId: currentWebsite, chats, missedChats });

		// 			chats = 0;
		// 			missedChats = 0;
		// 			currentWebsite = data[i].websiteId;
		// 		}
		// 		chats += data[i].chats;
		// 		missedChats += data[i].missedChats;
		// 	}
		// 	return newArray;


		// },
		// getFormattedDate(date) {
		// 	let year = date.getFullYear();
		// 	let month = (1 + date.getMonth()).toString().padStart(2, '0');
		// 	let day = date.getDate().toString().padStart(2, '0');
		// 	return month + '/' + day + '/' + year;
		// },
		// compare_dates(date1,date2){
		// 	if (date1>=date2) return 1;
		//   	else if (date1<=date2) return 2;
		//   	else return 3; 
		//  }
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
