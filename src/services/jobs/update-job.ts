import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import type { JobsRepository } from "@/repositories/jobs-repository";
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
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	country?: string;
	city?: string;
	zipCode?: string | null;
	jobTags?: string[];
	status?: JobStatus;
}

export class UpdateJobService {
	constructor(private readonly jobsRepository: JobsRepository) {}

	async execute(data: UpdateJobRequest) {
		const job = await this.jobsRepository.findById(data.id);

		if (!job) {
			throw new JobNotFoundException();
		}

		const updatedJob = await this.jobsRepository.update(data.id, data);

		return updatedJob;
	}
}
