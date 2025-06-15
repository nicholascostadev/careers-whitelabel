import { db } from "@/lib/infra/database.js";
import { JobApplication } from "@/models/index.js";
import type { JobApplicationsRepository } from "../job-application-repository.js";

export class PrismaJobApplicationsRepository
	implements JobApplicationsRepository
{
	async create(jobApplication: JobApplication): Promise<JobApplication> {
		// Convert domain model to database entity
		const prismaJobApplication = await db.jobApplication.create({
			data: {
				email: jobApplication.email,
				firstName: jobApplication.firstName,
				lastName: jobApplication.lastName,
				phone: jobApplication.phone,
				resumeURL: jobApplication.resumeURL,
				jobId: jobApplication.jobId,
				status: jobApplication.status,
			},
		});

		// Convert database entity back to domain model
		return JobApplication.fromData({
			id: prismaJobApplication.id,
			email: prismaJobApplication.email,
			firstName: prismaJobApplication.firstName,
			lastName: prismaJobApplication.lastName,
			phone: prismaJobApplication.phone ?? undefined,
			resumeURL: prismaJobApplication.resumeURL ?? undefined,
			jobId: prismaJobApplication.jobId,
			status: prismaJobApplication.status,
			createdAt: prismaJobApplication.createdAt,
		});
	}

	async findByApplicantEmailAndJobId(
		applicantEmail: string,
		jobId: string,
	): Promise<JobApplication | null> {
		const prismaJobApplication = await db.jobApplication.findFirst({
			where: {
				email: applicantEmail,
				jobId,
			},
		});

		if (!prismaJobApplication) {
			return null;
		}

		// Convert database entity to domain model
		return JobApplication.fromData({
			id: prismaJobApplication.id,
			email: prismaJobApplication.email,
			firstName: prismaJobApplication.firstName,
			lastName: prismaJobApplication.lastName,
			phone: prismaJobApplication.phone ?? undefined,
			resumeURL: prismaJobApplication.resumeURL ?? undefined,
			jobId: prismaJobApplication.jobId,
			status: prismaJobApplication.status,
			createdAt: prismaJobApplication.createdAt,
		});
	}
}
