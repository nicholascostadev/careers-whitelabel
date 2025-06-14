import { DepartmentNotFoundException } from "@/exceptions/department-not-found.js";
import type { DepartmentsRepository } from "@/repositories/departments-repository.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";
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
	status?: JobStatus;
	tags?: string[];
}

export class CreateJobService {
	constructor(
		private jobsRepository: JobsRepository,
		private departmentsRepository: DepartmentsRepository,
	) {}

	async execute(data: CreateJobRequest) {
		const department = await this.departmentsRepository.findById(
			data.departmentId,
		);

		if (!department) {
			throw new DepartmentNotFoundException();
		}

		const job = await this.jobsRepository.create({
			...data,
			status: data.status ?? JobStatus.OPEN,
			tags: data.tags ?? [],
		});

		return job;
	}
}
