import type { Department, Job, JobTag } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type {
	CreateJobRequest,
	FindManyJobsRequest,
	JobsRepository,
	ListJobsResponse,
	UpdateJobRequest,
} from "../jobs-repository.js";

type DepartmentsRepository = {
	findById: (id: string) => Promise<Department | null>;
	findByName: (name: string) => Promise<Department | null>;
	create: (data: { id?: string; name: string }) => Promise<Department>;
};

export class InMemoryJobsRepository implements JobsRepository {
	items: (Job & { tags: JobTag[]; department: Department })[] = [];
	jobTags: string[] = [];
	departmentsRepository?: DepartmentsRepository;

	constructor(departmentsRepository?: DepartmentsRepository) {
		this.departmentsRepository = departmentsRepository;
	}

	async create(data: CreateJobRequest) {
		const notFoundJobTags = data.tags?.filter(
			(tag) => !this.jobTags.some((t) => t === tag),
		);

		if (notFoundJobTags?.length) {
			this.jobTags.push(...notFoundJobTags);
		}

		const tags = data.tags.map((tag) => ({
			id: randomUUID(),
			name: tag,
			jobId: null,
		}));

		// Handle department lookup or creation
		let department: Department;

		if (this.departmentsRepository) {
			// Try to find existing department by name
			let existingDepartment = await this.departmentsRepository.findByName(
				data.departmentName,
			);
			if (!existingDepartment) {
				// Create new department if not found
				existingDepartment = await this.departmentsRepository.create({
					name: data.departmentName,
				});
			}
			department = existingDepartment;
		} else {
			// Fallback for tests that don't provide departmentsRepository
			department = {
				id: randomUUID(),
				name: data.departmentName,
			};
		}

		const job = {
			...data,
			id: data.id ?? randomUUID(),
			createdAt: data.createdAt ?? new Date(),
			zipCode: data.zipCode ?? null,
			salaryMin: data.salaryMin ?? null,
			salaryMax: data.salaryMax ?? null,
			tags,
			updatedAt: new Date(),
			department,
			departmentId: department.id,
		};

		this.items.push(job);

		return job;
	}

	async findById(id: string) {
		const job = this.items.find((job) => job.id === id);

		if (!job) {
			return null;
		}

		return job;
	}

	async findMany(
		data: FindManyJobsRequest,
		page: number,
	): Promise<ListJobsResponse> {
		const jobs = this.items.filter((job) => {
			if (data.departmentName && job.department.name !== data.departmentName) {
				return false;
			}

			if (data.jobTitle && !job.title.includes(data.jobTitle)) {
				return false;
			}

			if (data.salaryMin && job.salaryMin && job.salaryMin < data.salaryMin) {
				return false;
			}

			if (data.salaryMax && job.salaryMax && job.salaryMax > data.salaryMax) {
				return false;
			}

			if (
				data.workplaceLocation &&
				job.workplaceLocation !== data.workplaceLocation
			) {
				return false;
			}

			if (data.employmentType && job.employmentType !== data.employmentType) {
				return false;
			}

			if (
				data.country &&
				!job.country.toLowerCase().includes(data.country.toLowerCase())
			) {
				return false;
			}

			if (
				data.city &&
				!job.city.toLowerCase().includes(data.city.toLowerCase())
			) {
				return false;
			}

			if (data.tags && data.tags.length > 0) {
				if (!job.tags.some((tag) => data.tags.includes(tag.name))) {
					return false;
				}
			}

			return true;
		});

		const startIndex = (page - 1) * 10;
		const endIndex = startIndex + 10;

		return {
			jobs: jobs.slice(startIndex, endIndex),
			totalCount: jobs.length,
			totalPages: Math.ceil(jobs.length / 10),
		};
	}

	async update(id: string, data: UpdateJobRequest) {
		const jobIndex = this.items.findIndex((job) => job.id === id);

		if (jobIndex === -1) {
			throw new Error();
		}

		const currentJob = this.items[jobIndex];

		if (!currentJob) {
			throw new Error();
		}

		const updatedJobTags =
			data.tags?.map((tagName) => ({
				id: crypto.randomUUID(),
				name: tagName,
				jobId: id,
			})) ?? currentJob.tags;

		// Handle department update
		let department = currentJob.department;

		if (
			data.departmentName &&
			data.departmentName !== currentJob.department.name
		) {
			if (this.departmentsRepository) {
				// Try to find existing department by name
				let existingDepartment = await this.departmentsRepository.findByName(
					data.departmentName,
				);
				if (!existingDepartment) {
					// Create new department if not found
					existingDepartment = await this.departmentsRepository.create({
						name: data.departmentName,
					});
				}
				department = existingDepartment;
			} else {
				// Fallback for tests that don't provide departmentsRepository
				department = {
					id: randomUUID(),
					name: data.departmentName,
				};
			}
		}

		this.items[jobIndex] = {
			...currentJob,
			title: data.title ?? currentJob.title,
			descriptionMarkdown:
				data.descriptionMarkdown ?? currentJob.descriptionMarkdown,
			salaryMin:
				data.salaryMin === undefined ? currentJob.salaryMin : data.salaryMin,
			salaryMax:
				data.salaryMax === undefined ? currentJob.salaryMax : data.salaryMax,
			workplaceLocation: data.workplaceLocation ?? currentJob.workplaceLocation,
			employmentType: data.employmentType ?? currentJob.employmentType,
			country: data.country ?? currentJob.country,
			city: data.city ?? currentJob.city,
			zipCode: data.zipCode === undefined ? currentJob.zipCode : data.zipCode,
			tags: updatedJobTags,
			status: data.status ?? currentJob.status,
			department,
			departmentId: department.id,
		};

		return this.items[jobIndex];
	}
}
