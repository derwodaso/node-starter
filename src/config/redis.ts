import { ClientOpts } from "redis";

const redisConfig: ClientOpts = {
	host: "localhost",
	port: 6379,
	// Use a password in production.
	// password: "7c121ea0-95c2-4c76-a72c-0ce32f96210b"
};

export { redisConfig } ;