import type { JobApplication } from "@/models/index.js";
import type { JobApplicationsRepository } from "../job-application-repository.js";

export class InMemoryJobApplicationsRepository
	implements JobApplicationsRepository
{
	items: JobApplication[] = [];

	async create(jobApplication: JobApplication): Promise<JobApplication> {
		// Domain model is already validated, just store it
		this.items.push(jobApplication);
		return jobApplication;
	}

	async findByApplicantEmailAndJobId(
		applicantEmail: string,
		jobId: string,
	): Promise<JobApplication | null> {
		const jobApplication = this.items.find(
			(item) => item.email === applicantEmail && item.jobId === jobId,
		);

		return jobApplication ?? null;
	}
}
