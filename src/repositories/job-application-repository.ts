import type { JobApplication, Prisma } from "@prisma/client";

export interface JobApplicationsRepository {
	findByApplicantEmailAndJobId(
		applicantEmail: string,
		jobId: string,
	): Promise<JobApplication | null>;
	create(
		data: Prisma.JobApplicationUncheckedCreateInput,
	): Promise<JobApplication>;
}
