import * as express from "express";
import * as expressValidator from "express-validator";
import * as compression from "compression";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as errorhandler from "errorhandler";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as path from "path";
import * as passport from "passport";
import logger from "./logger";

import {
	REDIS_STORE_URI,
	SESSION_SECRET,
	ENVIRONMENT
} from "./config/app";

const RedisStore = require("connect-redis")(session);

export class App {

	public run() {
		// Load environment variables from .env file, where API keys and passwords are configured
		dotenv.config({ path: ".env.example" });

		const app: express.Express = express();

		// Express configuration
		app.set("port", process.env.PORT || 3000);
		app.use(compression());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(expressValidator());
		app.use(session({
			resave: true,
			saveUninitialized: true,
			secret: SESSION_SECRET,
			store: new RedisStore({
				url: REDIS_STORE_URI,
				autoReconnect: true
			})
		}));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(lusca.xframe("SAMEORIGIN"));
		app.use(lusca.xssProtection(true));
		app.use((req, res, next) => {
			res.locals.user = req.user;
			next();
		});

		app.use((req, res, next) => {
			// After successful login, redirect back to the intended page
			if (!req.user &&
				req.path !== "/login" &&
				req.path !== "/signup" &&
				!req.path.match(/^\/auth/) &&
				!req.path.match(/\./)) {
				req.session.returnTo = req.path;
			} else if (req.user &&
				req.path == "/account") {
				req.session.returnTo = req.path;
			}
			next();
		});

		app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

		if (ENVIRONMENT != "production") {
			app.use(errorhandler());
		}

		return app.listen(app.get("port"), () => {
			console.log(
				"  App is running at http://localhost:%d in %s mode",
				app.get("port"),
				app.get("env")
			);
			console.log("  Press CTRL-C to stop\n");
		});
	}
}

const app = new App();
app.run();





