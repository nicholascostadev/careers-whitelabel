import { db } from "@/lib/infra/database";
import type { JobApplication, Prisma } from "@prisma/client";
import type { JobApplicationsRepository } from "../job-application-repository";

export class PrismaJobApplicationsRepository
	implements JobApplicationsRepository
{
	async create(
		data: Prisma.JobApplicationUncheckedCreateInput,
	): Promise<JobApplication> {
		const jobApplication = await db.jobApplication.create({
			data,
		});

		return jobApplication;
	}

	async findByApplicantEmailAndJobId(
		applicantEmail: string,
		jobId: string,
	): Promise<JobApplication | null> {
		const jobApplication = await db.jobApplication.findFirst({
			where: {
				email: applicantEmail,
				jobId,
			},
		});

		return jobApplication ?? null;
	}
}
