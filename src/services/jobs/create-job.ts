import { env } from "@/lib/env";
import type { JobsRepository } from "@/repositories/jobs-repository";
import {
	type EmploymentType,
	JobStatus,
	type WorkplaceLocation,
} from "@prisma/client";

interface CreateJobRequest {
	title: string;
	descriptionMarkdown: string;
	departmentId: string;
	country: string;
	city: string;
	workplaceLocation: WorkplaceLocation;
	employmentType: EmploymentType;
	salaryMin?: number;
	salaryMax?: number;
	jobStatus?: JobStatus;
	jobTags?: string[];
}

export class CreateJobService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(data: CreateJobRequest) {
		const job = await this.jobsRepository.create({
			...data,
			organizationId: env.ORGANIZATION_ID,
			jobStatus: data.jobStatus ?? JobStatus.OPEN,
			jobTags: data.jobTags ?? [],
		});

		return job;
	}
}
