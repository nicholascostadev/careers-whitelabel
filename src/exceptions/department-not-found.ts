import { Exception } from "./exception.js";

export class DepartmentNotFoundException extends Exception {
	statusCode = 404;

	constructor() {
		super("Department not found");
	}
}
