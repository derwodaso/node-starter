import * as passport from "passport";
import * as express from "express";
import * as passwordHash from "password-hash";
import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { Score } from "../../data/entity/score";
import { User } from "../../data/entity/user";
import { Credentials } from "../../models/credentials";
import { jwtOptions } from "../../config/jwt";
import { v1 } from "./router";
import { RedisStore } from "../../data/redis";

v1.post("/auth", async (req, res) => {
	// Authentication and authorization strongly depends on the client's data.
	// We may need to query the steam service from here to get details about a user.
	const credentials = req.body as Credentials;

	// const connection = getConnection();
	// const users = connection.getRepository<User>("user");
	// const user = await users.createQueryBuilder("user")
	// 	.where(`user.name = ${credentials.username}`)
	// 	.getOne();

	const user = {
		id: 1,
		username: "Peter"
	};

	await RedisStore.setUserAsync(user);
	const token = jwt.sign(user, jwtOptions.secretOrKey, {
			audience: jwtOptions.audience,
			issuer: jwtOptions.issuer,
			expiresIn: "2 days"
		});

	res.send(token);
});