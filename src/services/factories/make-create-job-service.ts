import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository";
import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository";
import { CreateJobService } from "../jobs/create-job";

export function makeCreateJobService() {
	const jobsRepository = new PrismaJobsRepository();
	const departmentsRepository = new PrismaDepartmentsRepository();
	const createJobService = new CreateJobService(
		jobsRepository,
		departmentsRepository,
	);

	return createJobService;
}
