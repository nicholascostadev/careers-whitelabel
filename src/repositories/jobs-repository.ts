import type { Job, Prisma } from "@prisma/client";

export interface FindManyJobsRequest {
	departmentId?: string;
	jobTitle?: string;
}

export interface JobsRepository {
	create(data: Prisma.JobUncheckedCreateInput): Promise<Job>;
	findById(id: string): Promise<Job | null>;
	findMany(
		data: FindManyJobsRequest,
		page: number,
	): Promise<{
		jobs: Job[];
		totalCount: number;
	}>;
}
