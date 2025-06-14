import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository.js";
import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository.js";
import { UpdateJobService } from "../jobs/update-job.js";

export function makeUpdateJobService() {
	const jobsRepository = new PrismaJobsRepository();
	const departmentsRepository = new PrismaDepartmentsRepository();
	const updateJobService = new UpdateJobService(
		jobsRepository,
		departmentsRepository,
	);

	return updateJobService;
}
