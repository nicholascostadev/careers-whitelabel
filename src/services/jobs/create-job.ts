import { DepartmentNotFoundException } from "@/exceptions/department-not-found.js";
import type { CreateJobDto } from "@/lib/dtos/create-job.dto.js";
import { Department, Job, Location, SalaryRange } from "@/models/index.js";
import type { DepartmentsRepository } from "@/repositories/departments-repository.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class CreateJobService {
	constructor(
		private jobsRepository: JobsRepository,
		private departmentsRepository: DepartmentsRepository,
	) {}

	async execute(dto: CreateJobDto): Promise<Job> {
		const departmentData = await this.departmentsRepository.findById(
			dto.departmentId,
		);

		if (!departmentData) {
			throw new DepartmentNotFoundException();
		}

		const department = Department.fromData({
			id: departmentData.id,
			name: departmentData.name,
		});

		if (dto.salaryMin && dto.salaryMax) {
			try {
				SalaryRange.create(dto.salaryMin, dto.salaryMax);
			} catch {
				throw new Error(
					"Invalid salary range: minimum must be less than or equal to maximum",
				);
			}
		}

		const location = Location.create(dto.country, dto.city, dto.zipCode);

		const job = Job.create({
			title: dto.title.trim(),
			descriptionMarkdown: dto.descriptionMarkdown.trim(),
			workplaceLocation: dto.workplaceLocation,
			country: location.country,
			city: location.city,
			zipCode: location.zipCode,
			employmentType: dto.employmentType,
			salaryMin: dto.salaryMin,
			salaryMax: dto.salaryMax,
			status: dto.status ?? "OPEN",
			departmentId: department.id,
			tags:
				dto.tags?.map((tag) => ({
					id: crypto.randomUUID(),
					name: tag.trim(),
				})) ?? [],
		});

		const createdJob = await this.jobsRepository.create(job);

		return createdJob;
	}
}
