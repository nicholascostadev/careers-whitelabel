import { Exception } from "./exception.js";

export class ResourceNotFoundException extends Exception {
	statusCode = 404;

	constructor(resource: string) {
		super(`${resource} not found`);
	}
}
