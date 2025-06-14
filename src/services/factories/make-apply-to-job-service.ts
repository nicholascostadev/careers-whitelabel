import { PrismaJobApplicationsRepository } from "@/repositories/prisma/prisma-job-applications-repository.js";
import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository.js";
import { ApplyToJobService } from "../job-applications/apply-to-job.js";

export function makeApplyToJobService() {
	const jobsRepository = new PrismaJobsRepository();
	const jobApplicationsRepository = new PrismaJobApplicationsRepository();
	const applyToJobService = new ApplyToJobService(
		jobsRepository,
		jobApplicationsRepository,
	);

	return applyToJobService;
}
