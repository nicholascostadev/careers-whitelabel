import type { Job, Prisma } from "@prisma/client";

export interface JobsRepository {
	create(data: Prisma.JobUncheckedCreateInput): Promise<Job>;
}
