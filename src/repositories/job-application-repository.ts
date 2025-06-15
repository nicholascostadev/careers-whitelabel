import type { JobApplication } from "@/models/index.js";

export interface JobApplicationsRepository {
	findByApplicantEmailAndJobId(
		applicantEmail: string,
		jobId: string,
	): Promise<JobApplication | null>;
	create(jobApplication: JobApplication): Promise<JobApplication>;
}
