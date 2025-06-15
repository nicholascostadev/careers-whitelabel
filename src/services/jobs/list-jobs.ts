import type { ListJobsDTO } from "@/lib/dtos/list-jobs.dto.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class ListJobsService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(dto: ListJobsDTO) {
		const jobs = await this.jobsRepository.findMany(
			{
				departmentName: dto.departmentName,
				jobTitle: dto.jobTitle,
				tags: dto.tags ?? [],
				salaryMin: dto.salaryMin,
				salaryMax: dto.salaryMax,
				workplaceLocation: dto.workplaceLocation,
				employmentType: dto.employmentType,
				country: dto.country,
				city: dto.city,
			},
			dto.page,
			dto.itemsPerPage,
		);

		return jobs;
	}
}
