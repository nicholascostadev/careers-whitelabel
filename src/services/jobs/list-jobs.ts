import type { JobsRepository } from "@/repositories/jobs-repository";
import type { EmploymentType, WorkplaceLocation } from "@prisma/client";

interface ListJobsRequest {
	departmentId?: string;
	jobTitle?: string;
	page: number;
	salaryMin?: number;
	salaryMax?: number;
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	country?: string;
	city?: string;
	zipCode?: string;
	tags?: string[];
}

export class ListJobsService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(data: ListJobsRequest) {
		const jobs = await this.jobsRepository.findMany(
			{
				departmentId: data.departmentId,
				jobTitle: data.jobTitle,
				tags: data.tags ?? [],
				salaryMin: data.salaryMin,
				salaryMax: data.salaryMax,
				workplaceLocation: data.workplaceLocation,
				employmentType: data.employmentType,
				country: data.country,
				city: data.city,
			},
			data.page,
		);

		return jobs;
	}
}
