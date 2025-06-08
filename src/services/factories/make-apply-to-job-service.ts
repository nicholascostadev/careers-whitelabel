import { PrismaJobApplicationsRepository } from "@/repositories/prisma/prisma-job-applications-repository";
import { PrismaJobsRepository } from "@/repositories/prisma/prisma-jobs-repository";
import { ApplyToJobService } from "../job-applications/apply-to-job";

export function makeApplyToJobService() {
	const jobsRepository = new PrismaJobsRepository();
	const jobApplicationsRepository = new PrismaJobApplicationsRepository();
	const applyToJobService = new ApplyToJobService(
		jobsRepository,
		jobApplicationsRepository,
	);

	return applyToJobService;
}
