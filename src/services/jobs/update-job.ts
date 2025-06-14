import { DepartmentNotFoundException } from "@/exceptions/department-not-found.js";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { DepartmentsRepository } from "@/repositories/departments-repository.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";
import type {
	EmploymentType,
	JobStatus,
	WorkplaceLocation,
} from "@prisma/client";

interface UpdateJobRequest {
	id: string;
	title?: string;
	descriptionMarkdown?: string;
	salaryMin?: number | null;
	salaryMax?: number | null;
	departmentName?: string;
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	country?: string;
	city?: string;
	zipCode?: string | null;
	tags?: string[];
	status?: JobStatus;
}

export class UpdateJobService {
	constructor(
		private readonly jobsRepository: JobsRepository,
		private readonly departmentsRepository: DepartmentsRepository,
	) {}

	async execute(data: UpdateJobRequest) {
		const job = await this.jobsRepository.findById(data.id);

		if (!job) {
			throw new JobNotFoundException();
		}

		if (data.departmentName) {
			const department = await this.departmentsRepository.findByName(
				data.departmentName,
			);

			if (!department) {
				throw new DepartmentNotFoundException();
			}
		}

		const updatedJob = await this.jobsRepository.update(data.id, data);

		return updatedJob;
	}
}
