import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository";
import { ListJobsService } from "../jobs/list-jobs";

export function makeListJobsService() {
	const jobsRepository = new PrismaJobsRepository();
	const listJobsService = new ListJobsService(jobsRepository);

	return listJobsService;
}
