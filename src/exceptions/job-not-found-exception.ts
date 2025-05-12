import { ResourceNotFoundException } from "./resource-not-found-exception";

export class JobNotFoundException extends ResourceNotFoundException {
	constructor() {
		super("Job");
	}
}
