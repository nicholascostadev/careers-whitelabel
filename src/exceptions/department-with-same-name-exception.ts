import { Exception } from "./exception";

export class DepartmentWithSameNameException extends Exception {
	statusCode = 400;

	constructor() {
		super("Department with same name already exists");
	}
}
