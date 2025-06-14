import { Exception } from "./exception.js";

export class DepartmentWithSameNameException extends Exception {
	statusCode = 400;

	constructor() {
		super("Department with same name already exists");
	}
}
