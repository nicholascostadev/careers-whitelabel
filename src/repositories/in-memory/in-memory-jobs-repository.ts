import type { Job, JobTag } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type {
	CreateJobRequest,
	FindManyJobsRequest,
	JobsRepository,
	UpdateJobRequest,
} from "../jobs-repository";

export class InMemoryJobsRepository implements JobsRepository {
	items: (Job & { jobTags: JobTag[] })[] = [];
	jobTags: string[] = [];

	async create(data: CreateJobRequest) {
		const notFoundJobTags = data.jobTags?.filter(
			(tag) => !this.jobTags.some((t) => t === tag),
		);

		if (notFoundJobTags?.length) {
			this.jobTags.push(...notFoundJobTags);
		}

		const jobTags = data.jobTags.map((tag) => ({
			id: randomUUID(),
			name: tag,
			jobId: null,
		}));

		const job = {
			...data,
			id: data.id ?? randomUUID(),
			createdAt: data.createdAt ?? new Date(),
			zipCode: data.zipCode ?? null,
			salaryMin: data.salaryMin ?? null,
			salaryMax: data.salaryMax ?? null,
			jobTags,
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
				if (!job.jobTags.some((tag) => data.jobTags.includes(tag.name))) {
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
			data.jobTags?.map((tagName) => ({
				id: crypto.randomUUID(),
				name: tagName,
				jobId: id,
			})) ?? currentJob.jobTags;

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
			jobTags: updatedJobTags,
			jobStatus: data.jobStatus ?? currentJob.jobStatus,
		};

		return this.items[jobIndex];
	}
}
