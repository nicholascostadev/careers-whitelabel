import type { Job } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type {
	CreateJobRequest,
	FindManyJobsRequest,
	JobsRepository,
} from "../jobs-repository";

export class InMemoryJobsRepository implements JobsRepository {
	items: (Job & { jobTags: string[] })[] = [];
	jobTags: string[] = [];

	async create(data: CreateJobRequest) {
		const notFoundJobTags = data.jobTags?.filter(
			(tag) => !this.jobTags.some((t) => t === tag),
		);

		if (notFoundJobTags?.length) {
			this.jobTags.push(...notFoundJobTags);
		}

		const job = {
			...data,
			id: data.id ?? randomUUID(),
			createdAt: data.createdAt ?? new Date(),
			zipCode: data.zipCode ?? null,
			salaryMin: data.salaryMin ?? null,
			salaryMax: data.salaryMax ?? null,
			jobTags: data.jobTags,
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

	async findMany(data: FindManyJobsRequest, page: number) {
		const jobs = this.items.filter((job) => {
			if (data.departmentId && job.departmentId !== data.departmentId) {
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

			if (data.jobTags && data.jobTags.length > 0) {
				if (!job.jobTags.some((tag) => data.jobTags.includes(tag))) {
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
		};
	}
}
