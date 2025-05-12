import { Exception } from "./exception";

export class ResourceNotFoundException extends Exception {
	statusCode = 404;

	constructor(resource: string) {
		super(`${resource} not found`);
	}
}
