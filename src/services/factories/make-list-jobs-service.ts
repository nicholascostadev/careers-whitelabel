import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository.js";
import { ListJobsService } from "../jobs/list-jobs.js";

export function makeListJobsService() {
	const jobsRepository = new PrismaJobsRepository();
	const listJobsService = new ListJobsService(jobsRepository);

	return listJobsService;
}
