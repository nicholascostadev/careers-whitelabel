import { Exception } from "./exception";

export class DepartmentNotFoundException extends Exception {
	statusCode = 404;

	constructor() {
		super("Department not found");
	}
}
