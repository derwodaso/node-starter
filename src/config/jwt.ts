import { StrategyOptions, ExtractJwt } from "passport-jwt";

const jwtOptions: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: "f05925f2-b150-44c0-b46c-b4e32fe07c39",
	issuer: "accounts.lonelymountains.com",
	audience: "user.lonelymountains.com"
};

export { jwtOptions };