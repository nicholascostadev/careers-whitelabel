import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository";
import { GetJobInfoService } from "../jobs/get-job-info";

export function makeGetJobInfoService() {
	const jobsRepository = new PrismaJobsRepository();
	const getJobInfoService = new GetJobInfoService(jobsRepository);

	return getJobInfoService;
}
