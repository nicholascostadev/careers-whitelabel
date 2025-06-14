import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class GetJobInfoService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(id: string) {
		console.log("id", id);
		const job = await this.jobsRepository.findById(id);

		if (!job) {
			throw new JobNotFoundException();
		}

		return {
			job,
		};
	}
}
