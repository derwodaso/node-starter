import * as passport from "passport";
import * as express from "express";
import { getConnection } from "typeorm";
import { Score } from "../../data/entity/score";
import { User } from "../../data/entity/user";
import { v1 } from "./router";

v1.get("/scores", passport.authorize("jwt", { session: false }),
	async (req: any, res) => {
		try {
			const id = req.account.id;
			const connection = getConnection();
			const users = await connection.getRepository<User>("user");
			const user = await users.findOne(id);
			res.json(user.scores);
		} catch (error) {
			res.status(500).send(error);
		}
	});

v1.post("/scores", passport.authorize("jwt", { session: false }),
	async (req: any, res) => {
		try {
			const id = req.account.id;
			const connection = getConnection();
			const users = await connection.getRepository<User>("user");
			const user = await users.findOne(id);
			// Parse body in req.body
			const score = new Score();
			user.scores.push(score);
			res.status(201).json(score);
		} catch (error) {
			res.status(500).send(error);
		}
	});