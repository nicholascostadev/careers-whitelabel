import type { Job, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type { JobsRepository } from "../jobs-repository";

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
}
