import type { JobsRepository } from "@/repositories/jobs-repository";

interface ListJobsRequest {
	departmentId?: string;
	jobTitle?: string;
	page: number;
}

export class ListJobsService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(data: ListJobsRequest) {
		const jobs = await this.jobsRepository.findMany(
			{
				departmentId: data.departmentId,
				jobTitle: data.jobTitle,
			},
			data.page,
		);

		return jobs;
	}
}
