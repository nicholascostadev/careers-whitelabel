import { DepartmentNotFoundException } from "@/exceptions/department-not-found.js";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { UpdateJobDTO } from "@/lib/dtos/update-job.dto.js";
import { Job } from "@/models/index.js";
import type { DepartmentsRepository } from "@/repositories/departments-repository.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class UpdateJobService {
	constructor(
		private readonly jobsRepository: JobsRepository,
		private readonly departmentsRepository: DepartmentsRepository,
	) {}

	async execute(dto: UpdateJobDTO): Promise<Job> {
		const existingJob = await this.jobsRepository.findById(dto.id);

		if (!existingJob) {
			throw new JobNotFoundException();
		}

		if (dto.departmentId) {
			const department = await this.departmentsRepository.findById(
				dto.departmentId,
			);

			if (!department) {
				throw new DepartmentNotFoundException();
			}
		}

		// Filter out undefined values to avoid overwriting existing data
		const updates: Parameters<typeof existingJob.update>[0] = {};
		if (dto.title !== undefined) updates.title = dto.title;
		if (dto.descriptionMarkdown !== undefined)
			updates.descriptionMarkdown = dto.descriptionMarkdown;
		if (dto.workplaceLocation !== undefined)
			updates.workplaceLocation = dto.workplaceLocation;
		if (dto.country !== undefined) updates.country = dto.country;
		if (dto.city !== undefined) updates.city = dto.city;
		if (dto.zipCode !== undefined) updates.zipCode = dto.zipCode;
		if (dto.employmentType !== undefined)
			updates.employmentType = dto.employmentType;
		if (dto.salaryMin !== undefined) updates.salaryMin = dto.salaryMin;
		if (dto.salaryMax !== undefined) updates.salaryMax = dto.salaryMax;
		if (dto.status !== undefined) updates.status = dto.status;

		let updatedJob = existingJob.update(updates);

		if (dto.tags) {
			updatedJob = updatedJob.setTags(dto.tags);
		}

		if (dto.departmentId && dto.departmentId !== existingJob.departmentId) {
			const jobData = updatedJob.toData();
			jobData.departmentId = dto.departmentId;
			updatedJob = Job.fromData(jobData);
		}

		const savedJob = await this.jobsRepository.update(updatedJob);

		return savedJob;
	}
}
