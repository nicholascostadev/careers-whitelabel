import { JobApplicationAlreadySubmittedException } from "@/exceptions/job-application-already-submitted-exception";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import type { JobApplicationsRepository } from "@/repositories/job-application-repository";
import type { JobsRepository } from "@/repositories/jobs-repository";

interface ApplyToJobRequest {
	jobId: string;
	applicantFirstName: string;
	applicantLastName: string;
	applicantEmail: string;
	applicantPhone: string;
	applicantResumeUrl: string;
}

export class ApplyToJobService {
	constructor(
		private jobsRepository: JobsRepository,
		private jobApplicationsRepository: JobApplicationsRepository,
	) {}

	async execute(data: ApplyToJobRequest) {
		const job = await this.jobsRepository.findById(data.jobId);

		if (!job) {
			throw new JobNotFoundException();
		}

		const jobApplication =
			await this.jobApplicationsRepository.findByApplicantEmailAndJobId(
				data.applicantEmail,
				data.jobId,
			);

		if (jobApplication) {
			throw new JobApplicationAlreadySubmittedException();
		}

		const createdJobApplication = await this.jobApplicationsRepository.create({
			email: data.applicantEmail,
			firstName: data.applicantFirstName,
			lastName: data.applicantLastName,
			phone: data.applicantPhone,
			resumeURL: data.applicantResumeUrl,
			jobId: data.jobId,
		});

		return createdJobApplication;
	}
}
