import { env } from "@/lib/env";
import type { JobsRepository } from "@/repositories/jobs-repository";

interface CreateJobRequest {
	title: string;
	descriptionMarkdown: string;
}

export class CreateJobService {
	constructor(private jobsRepository: JobsRepository) {}

	async execute(data: CreateJobRequest) {
		const job = await this.jobsRepository.create({
			...data,
			organizationId: env.ORGANIZATION_ID,
		});

		return job;
	}
}
