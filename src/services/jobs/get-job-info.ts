import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class GetJobInfoService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(id: string) {
		const jobWithDepartment = await this.jobsRepository.findById(id);

		if (!jobWithDepartment) {
			throw new JobNotFoundException();
		}

		return jobWithDepartment;
	}
}
