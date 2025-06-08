import { Exception } from "./exception";

export class JobClosedException extends Exception {
	statusCode = 400;

	constructor() {
		super("Job is closed and cannot be applied to");
	}
}
