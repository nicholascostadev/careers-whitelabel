import { Exception } from "./exception.js";

export class OrganizationNotCreatedException extends Exception {
	statusCode = 400;

	constructor() {
		super("Organization not created");
	}
}
