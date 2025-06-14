import { ResourceNotFoundException } from "./resource-not-found-exception.js";

export class JobNotFoundException extends ResourceNotFoundException {
	constructor() {
		super("Job");
	}
}
