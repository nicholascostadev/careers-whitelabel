import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository";
import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository";
import { UpdateJobService } from "../jobs/update-job";

export function makeUpdateJobService() {
	const jobsRepository = new PrismaJobsRepository();
	const departmentsRepository = new PrismaDepartmentsRepository();
	const updateJobService = new UpdateJobService(
		jobsRepository,
		departmentsRepository,
	);

	return updateJobService;
}
