import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import type { JobsRepository } from "@/repositories/jobs-repository";

export class GetJobInfoService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(id: string) {
		const job = await this.jobsRepository.findById(id);

		if (!job) {
			throw new JobNotFoundException();
		}

		return {
			job,
		};
	}
}
