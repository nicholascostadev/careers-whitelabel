import { Exception } from "./exception.js";

export class InvalidPasswordException extends Exception {
	statusCode = 400;

	constructor() {
		super("Password is incorrect");
	}
}
