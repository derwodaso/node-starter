import "reflect-metadata";
import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as express from "express";
import * as expressValidator from "express-validator";
import * as compression from "compression";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as errorhandler from "errorhandler";
import * as lusca from "lusca";
import * as path from "path";
import * as jwt from "jsonwebtoken";

import { jwtOptions } from "./config/jwt";
import { typeOrmConfig } from "./config/typeorm";
import { createConnection, getConnection } from "typeorm";
import { RedisStore } from "./data/redis";
import { v1 } from "./controllers/v1/router";

import "./controllers/v1/auth";
import "./controllers/v1/scores";

import logger from "./logger";

// User verification using the redis store.

passport.use(new passportJwt.Strategy(jwtOptions, async (token, next) => {
	try {
		const payload = token as any;
		const user = await RedisStore.getUserAsync(payload.id);

		if (user) {
			next(undefined, user, {
				message: "That is all she said ...",
				scope: "all"
			});
		} else {
			next(undefined, false);
		}
	} catch (error) {
		next(error);
	}
}));

export class App {
	private initExpress() {

		const app: express.Express = express();

		// Express configuration
		app.set("port", process.env.PORT || 3000);
		app.use(compression());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(expressValidator());
		app.use(passport.initialize());
		app.use(lusca.xframe("SAMEORIGIN"));
		app.use(lusca.xssProtection(true));

		if (process.env.NODE_ENV == "development") {
			app.use(errorhandler());
		}

		app.use("/v1", v1);
		app.use("/", v1);

		return app.listen(app.get("port"), () => {
			console.log(
				"  App is running at http://localhost:%d in %s mode",
				app.get("port"),
				app.get("env")
			);
			console.log("  Press CTRL-C to stop\n");
		});
	}

	private async initSql() {
		await createConnection(typeOrmConfig);
	}

	public async run() {
		await this.initSql();
		return this.initExpress();
	}
}

const app = new App();
app.run();





