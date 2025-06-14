import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository.js";
import { GetJobInfoService } from "../jobs/get-job-info.js";

export function makeGetJobInfoService() {
	const jobsRepository = new PrismaJobsRepository();
	const getJobInfoService = new GetJobInfoService(jobsRepository);

	return getJobInfoService;
}
