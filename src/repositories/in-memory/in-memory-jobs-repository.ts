import type { Job, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type { FindManyJobsRequest, JobsRepository } from "../jobs-repository";

export class InMemoryJobsRepository implements JobsRepository {
	items: Job[] = [];

	async create({ id, createdAt, ...data }: Prisma.JobUncheckedCreateInput) {
		const job = {
			id: id ?? randomUUID(),
			createdAt: new Date(createdAt ?? Date.now()),
			...data,
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
