import * as redis from "redis";
import { redisConfig } from "../config/redis";
import { User } from "../models/user";

const redisClient = redis.createClient(redisConfig);

export class RedisStore {
	public static setUserAsync(user: User) {
		return new Promise((resolve, reject) => {
			redisClient.set(`user:${user.id}`, JSON.stringify(user), (error, ok) => {
				if (error) {
					reject(error);
				}

				resolve();
			});
		});
	}

	public static getUserAsync(id: number): Promise<User> {
		return new Promise((resolve, reject) => {
			redisClient.get(`user:${id}`, (error, user) => {
				if (error) {
					reject(error);
				}

				resolve(JSON.parse(user));
			});
		});
	}
}