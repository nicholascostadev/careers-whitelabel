import { Exception } from "./exception.js";

export class UnauthorizedException extends Exception {
	statusCode = 401;

	constructor() {
		super("Unauthorized");
	}
}
