import type { Department, Job } from "@/models/index.js";
import type { JobTag } from "@prisma/client";
import type { DepartmentsRepository } from "../departments-repository.js";
import type {
	FindManyJobsRequest,
	JobWithDepartment,
	JobsRepository,
	ListJobsResponse,
} from "../jobs-repository.js";

type JobStorageItem = {
	job: Job;
	tags: JobTag[];
	department: Department;
};

export class InMemoryJobsRepository implements JobsRepository {
	items: JobStorageItem[] = [];
	jobTags: string[] = [];
	departmentsRepository?: DepartmentsRepository;

	constructor(departmentsRepository?: DepartmentsRepository) {
		this.departmentsRepository = departmentsRepository;
	}

	async create(job: Job): Promise<Job> {
		let department: Department;

		if (this.departmentsRepository) {
			const existingDepartment = await this.departmentsRepository.findById(
				job.departmentId,
			);
			if (existingDepartment) {
				department = existingDepartment;
			} else {
				throw new Error("Department not found");
			}
		} else {
			throw new Error(
				"InMemoryJobsRepository requires a departmentsRepository instance",
			);
		}

		// Convert domain model tags to storage format
		const tags = job.tags.map((tag) => ({
			id: tag.id,
			name: tag.name,
			jobId: job.id,
		}));

		// Store the job with metadata separately
		this.items.push({
			job,
			tags,
			department,
		});

		return job;
	}

	async findById(id: string): Promise<JobWithDepartment | null> {
		const storageItem = this.items.find((item) => item.job.id === id);

		if (!storageItem) {
			return null;
		}

		// Return the domain model directly since it contains all the data
		return {
			job: storageItem.job,
			department: storageItem.department,
		};
	}

	async findMany(
		data: FindManyJobsRequest,
		page: number,
		itemsPerPage = 10,
	): Promise<ListJobsResponse> {
		const filteredJobs = this.items.filter((item) => {
			const job = item.job;

			if (data.departmentName && item.department.name !== data.departmentName) {
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
				if (!item.tags.some((tag) => data.tags.includes(tag.name))) {
					return false;
				}
			}

			return true;
		});

		const startIndex = (page - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;

		// Return the domain models directly
		const jobs = filteredJobs
			.slice(startIndex, endIndex)
			.map((item) => ({ job: item.job, department: item.department }));

		return {
			jobs,
			totalCount: filteredJobs.length,
			totalPages: Math.ceil(filteredJobs.length / itemsPerPage),
		};
	}

	async update(job: Job): Promise<Job> {
		const itemIndex = this.items.findIndex((item) => item.job.id === job.id);

		if (itemIndex === -1) {
			throw new Error("Job not found");
		}

		const currentItem = this.items[itemIndex];

		if (!currentItem) {
			throw new Error("Job not found");
		}

		const updatedJobTags = job.tags.map((tag) => ({
			id: tag.id,
			name: tag.name,
			jobId: job.id,
		}));

		let department = currentItem.department;

		if (job.departmentId !== currentItem.department.id) {
			if (this.departmentsRepository) {
				const existingDepartment = await this.departmentsRepository.findById(
					job.departmentId,
				);
				if (existingDepartment) {
					department = existingDepartment;
				}
			}
		}

		// Update the storage item with new data
		this.items[itemIndex] = {
			job,
			tags: updatedJobTags,
			department,
		};

		return job;
	}
}
