import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository.js";
import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository.js";
import { CreateJobService } from "../jobs/create-job.js";

export function makeCreateJobService() {
	const jobsRepository = new PrismaJobsRepository();
	const departmentsRepository = new PrismaDepartmentsRepository();
	const createJobService = new CreateJobService(
		jobsRepository,
		departmentsRepository,
	);

	return createJobService;
}
