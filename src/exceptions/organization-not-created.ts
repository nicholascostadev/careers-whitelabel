import { Exception } from "./exception";

export class OrganizationNotCreatedException extends Exception {
	statusCode = 400;

	constructor() {
		super("Organization not created");
	}
}
