import { Exception } from "./exception.js";

export class JobClosedException extends Exception {
	statusCode = 400;

	constructor() {
		super("Job is closed and cannot be applied to");
	}
}
