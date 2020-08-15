"use strict";
require("dotenv").config();

const { MoleculerClientError } = require("moleculer").Errors;
const uuidv1 = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const OAuth2Server = require("../mixins/oauth_server.mixin");

const User = require("../models").user;

sgMail.setApiKey("<SGMAIL APIKEY>");

module.exports = {
	name: "auth",
	logger: console,
	validation: true,

	mixins: [
		OAuth2Server
	],
    
	registry: {
		strategy: "RoundRobin"
	},
    
	metadata: {
		scalable: true,
		priority: 5
	},
	/**
	 * Service settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",
	},
    
	use: [

	],

	/**
	 * Service dependencies
	 */
	dependencies: [
		
	],	
    
	/**
	 * Events
	 */
	events: {
		"$node.connected"({ node }) {
			this.logger.info(`Node '${node.id}' is connected!`);
		}
	},

	/**
	 * Actions
	 */
	actions: {
		login: {
			cache:{
				enabled: false
			},
			params:{
				email: { min: 3, max: 255 , type: "email"},
				password: { type: "string", min: 6, max: 255 },
				client_id: { type: "string", min: 3, max: 255 },
				client_secret: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {
				const { email, client_id, client_secret, password } = ctx.params; 
				try {
					let user = await User.findOne({ where: {email: ctx.params.email}});
					if (user === null) {
						return new MoleculerClientError("Email does not exist", 422, "", [{ field: "email", message: "Email does not exist"}]);
					}  else if (user.type != "email") {
						return new MoleculerClientError("Your email provided is already linked on your facebook account. Please try using the facebook login. Thanks", 422, "", [{ field: "email", message: "Your email provided is already linked on your facebook account. Please try using the facebook. Thanks"}]);
					} else if (user.is_old) {
						return new MoleculerClientError("We upgrade and migrated our system. Please set a new password again.", 423, "", [{ field: "", message: "We upgrade and migrated our system. Please set a new password again."}]);
					}

					let res = await bcrypt.compare(ctx.params.password, user.password);
					
					if (!res) {
						return new MoleculerClientError("Wrong password!", 401, "", [{ field: "password", message: "is incorrect"}]);
					} 

					let token =  this.generateJWT(user);
					let refreshToken =  this.generateRefreshJWT(user);

					let client = await this.getClient(client_id, client_secret);

					const today = new Date();
					const exp = new Date(today);
					exp.setMonth(today.getMonth() + 1);

					let userObj = await this.getUser(email, password);
					let tokenObj = {
						accessToken: token,
						accessTokenExpiresAt: exp,
						refreshToken: refreshToken,
						scope: "user",
						client: client,
						user: userObj
					};
					let tokenRes = await this.saveToken(tokenObj, client, user);
					ctx.meta.user = userObj;
					let childrenObj = await ctx.call("child.getChild");
					tokenRes.user.children = childrenObj.data;

					return { message:"success", code:200, data: tokenRes };
				}catch (e) {
					console.log(e); 
				}
			}
		},
		refreshToken:{
			cache:{
				enabled: false
			},
			params:{
				refresh_token: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {

			}
		},
		sendVerficationCode: {
			cache: {
				enabled: false
			},
			params: {
				email: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {
				const { email } = ctx.params;

				try {
					let user = await User.findOne({ where: { email: email }});
					if (user === null) {
						return new MoleculerClientError("Email does not exist", 422, "", [{ field: "email", message: "is not found"}]);
					}

					let vCode = this.makeid(6);
					this.sendVerificationCode(email,vCode, user);
	
					try{
						await User.updateById( user.id , { $set: { updatedAt: new Date(), vcode: vCode }});
						return {message:"success",code:200,data:{}};
					} catch (e) {
						console.log(e); 
					}
					
				} catch (e) {
					console.log(e); 
				}
			}
		},
		verifyVCode: {
			cache: {
				enabled: false
			},
			params: {
				email: { type: "string", min: 3, max: 255 },
				vcode: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {
				const { email, vcode } = ctx.params;

				try {
					let user = await User.findOne({ where: { email: email, vcode: vcode }});
					if (user === null) {
						return new MoleculerClientError("Email does not exist", 422, "", [{ field: "email", message: "is not found"}]);
					}

					let vCode = this.makeid(6);
					this.sendVerificationCode(email,vCode, user);
	
					try{
						await User.updateById( user.id , { $set: { updatedAt: new Date(), vcode: "" }});
						return {message:"success",code:200,data:{}};
					} catch (e) {
						console.log(e); 
					}
					
				} catch (e) {
					console.log(e); 
				}
			}
		},
		changePassword:{
			cache:{
				enabled: false
			},
			params:{
				new_password: { type: "string", min: 3, max: 255 },
				confirm_password: { type: "string", min: 3, max: 255 },
				email: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {
				const { new_password, confirm_password,  email } = ctx.params;
				try {
					let user = await User.findOne({ where: { email: email }});
					if (user === null) {
						return new MoleculerClientError("Email does not exist", 422, "", [{ field: "email", message: "is not found"}]);
					}

					if(new_password !== confirm_password){
						return Promise.reject(new MoleculerClientError("Wrong new password is not the same", 422, "", [{ field: "new_password", message: "is a wrong password"},{ field: "confirm_password", message: "is a wrong password"}]));
					}else{
						let newPassword = bcrypt.hashSync(new_password, 10);
						await User.updateById( user.id , { $set: { updatedAt: new Date(), password: newPassword }});
						return {message:"success",code:200,data:{}};
					}

				} catch (e) {
					console.log(e); 
				}
			}
		},
		socialLogin: {
			cache:{
				enabled: false
			},
			params:{
				email: { type: "email", min: 3, max: 255 },
				name: { type: "string", min: 2, max: 255 },
				social_id: { type: "string", min: 3, max: 255 },
				image_url: { type: "url", min: 3, max: 255 },
				client_id: { type: "string", min: 3, max: 255 },
				client_secret: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {
				const { email, client_id, client_secret } = ctx.params;
				try {
					let user = await User.findOne({ 
						where: { email: email }
					});
			
					if(user !== null) {
						if (user.type === "email") {
							return new MoleculerClientError("Your email provided is already linked with password. Please use the Login Page.", 422, "", [{ field: "email", message: "Your email provided is already linked with password. Please use the Login Page."}]);
						}	

						let token =  this.generateJWT(user);
						let refreshToken =  this.generateRefreshJWT(user);

						let client = await this.getClient(client_id, client_secret);

						const today = new Date();
						const exp = new Date(today);
						exp.setMonth(today.getMonth() + 1);

						let userObj = await this.getUser(email, "");
						
						let tokenObj = {
							accessToken: token,
							accessTokenExpiresAt: exp,
							refreshToken: refreshToken,
							scope: "user",
							client: client,
							user: userObj
						};

						let tokenRes = await this.saveToken(tokenObj, client, user);
						ctx.meta.user = userObj;
						let childrenObj = await ctx.call("child.getChild");
						tokenRes.user.children = childrenObj.data;

						return { message:"success", code:200, data: tokenRes };
					} else {
						let entity = ctx.params;
						entity.id = uuidv1();
						entity.is_active = true;
						entity.type = "facebook";

						// let contact = await ctx.call("activeCampaign.createContacts", { user: entity });
						entity.active_campaign_id = "";

						let newUser = await User.create(entity);


						let token =  this.generateJWT(entity);
						let refreshToken =  this.generateRefreshJWT(entity);

						let client = await this.getClient(client_id, client_secret);

						const today = new Date();
						const exp = new Date(today);
						exp.setMonth(today.getMonth() + 1);

						let userObj = await this.getUser(email, "");
						
						let tokenObj = {
							accessToken: token,
							accessTokenExpiresAt: exp,
							refreshToken: refreshToken,
							scope: "user",
							client: client,
							user: userObj
						};

						let tokenRes = await this.saveToken(tokenObj, client, newUser);
						ctx.meta.user = userObj;
						let childrenObj = await ctx.call("child.getChild");
						tokenRes.user.children = childrenObj.data;

						return { message:"success", code:200, data: tokenRes };
					}
				} catch (e) {
					console.log(e); 
				}
			}
		},
		register:{
			cache:{
				enabled: false
			},
			params:{
				email: { type: "email", min: 3, max: 255 },
				password: { type: "string", min: 6, max: 255 },
				name: { type: "string", min: 2, max: 255 },
				client_id: { type: "string", min: 3, max: 255 },
				client_secret: { type: "string", min: 3, max: 255 }
			},
			async handler(ctx) {
				const { email, client_id, client_secret } = ctx.params; 

				try {
					let user = await User.findOne({ 
						where: { email: email },
						raw: true
					});

					if (user !== null) {
						if (user.type === "facebook") {
							return new MoleculerClientError("Your email provided is already linked on your facebook account. Please try using the facebook login. Thanks", 422, "", [{ field: "email", message: "Your email provided is already linked on your facebook account. Please try using the facebook. Thanks"}]);
						} else {
							return new MoleculerClientError("", 422, "Email exist", [{ field: "email", message: "Email exist"}]);
						}
					}

					try{
						let entity = ctx.params;
						entity.password = bcrypt.hashSync(entity.password, 10);
						entity.createdAt = new Date();
						entity.is_verified = false;
						entity.is_active = true;
						entity.type = "email";

						// let contact = await ctx.call("activeCampaign.createContacts", { user: entity });
						// console.log(contact);
						entity.active_campaign_id = "";

						let newUser = await User.create({
							name: entity.name,
							email: entity.email,
							password: entity.password,
							token: entity.token,
							is_verified: entity.is_verified,
							is_active: entity.is_active,
							type: entity.type,
						});

						let token =  this.generateJWT(entity);
						let refreshToken =  this.generateRefreshJWT(entity);

						let client = await this.getClient(client_id, client_secret);

						const today = new Date();
						const exp = new Date(today);
						exp.setMonth(today.getMonth() + 1);

						let userObj = await this.getUser(email, entity.password);

						let tokenObj = {
							accessToken: token,
							accessTokenExpiresAt: exp,
							refreshToken: refreshToken,
							scope: "user",
							client: client,
							user: userObj
						};

						let tokenRes = await this.saveToken(tokenObj, client, newUser);
						ctx.meta.user = userObj;
						let childrenObj = await ctx.call("child.getChild");
						tokenRes.user.children = childrenObj.data;

						return { message:"success", code:200, data: tokenRes };

					} catch (e) {
						console.log(e); 
					}
				} catch (e) {
					console.log(e); 
				}
			}
		},
		resolveToken: {
			params: {
				token: "string"
			},
			async handler (ctx) {

				try {
					let decoded = jwt.verify(ctx.params.token, this.settings.JWT_SECRET);
					let user = await User.findAll({ where: { token: ctx.params.token }, raw: true });
					return user;
				} catch(err) {
					console.log(err);
				}
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {
		generateJWT(user) {
			const today = new Date();
			const exp = new Date(today);
			exp.setDate(today.getDate() + 60);

			return jwt.sign({
				id: user._id,
				username: user.email,
				exp: Math.floor(exp.getTime() / 1000)
			}, this.settings.JWT_SECRET);
		},

		generateRefreshJWT(user) {
			const today = new Date();
			const exp = new Date(today);
			exp.setDate(today.getDate() + 1000);

			return jwt.sign({
				id: user._id,
				username: user.email,
				exp: Math.floor(exp.getTime() / 1000)
			}, this.settings.JWT_SECRET);
		},
		sendVerificationCode(email, vcode, user){
			const msg = {
				to: email,
				from: "",
				subject: "Your Verification Code",
				text: "Your verification code.",
				html: "Hello <strong>" + user.name + "</strong>,<br/> <br/> <br/>This is your verification code: <strong> " + vcode + " </strong> <br/><br/>Thanks, <br/><br/> Kiindred Team",
			};
			sgMail.send(msg);
		},
		makeid(length) {
			let result           = "";
			let characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			let charactersLength = characters.length;
			for ( let i = 0; i < length; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		//this.broker.cacher.clean();
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {
		//this.broker.cacher.clean();
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {
		//his.broker.cacher.clean();
	}
};