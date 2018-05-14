import logger from "../logger";
import * as dotenv from "dotenv";
import * as fs from "fs";

if (fs.existsSync(".env")) {
	logger.debug("Using .env file to supply config environment variables");
	dotenv.config({ path: ".env" });
} else {
	logger.debug("Using .env.example file to supply config environment variables");
	dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const REDIS_STORE_URI = prod ? process.env["REDIS_STORE_URI"] : process.env["REDIS_STORE_URI_LOCAL"];

if (!SESSION_SECRET) {
	logger.error("No client secret. Set SESSION_SECRET environment variable.");
	process.exit(1);
}

if (!REDIS_STORE_URI) {
	logger.error("No redis connection string. Set REDIS_STORE_URI environment variable.");
	process.exit(1);
}
