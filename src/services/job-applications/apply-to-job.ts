import { JobApplicationAlreadySubmittedException } from "@/exceptions/job-application-already-submitted-exception.js";
import { JobClosedException } from "@/exceptions/job-closed-exception.js";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { ApplyToJobDTO } from "@/lib/dtos/apply-to-job.dto.js";
import { Email, JobApplication } from "@/models/index.js";
import type { JobApplicationsRepository } from "@/repositories/job-application-repository.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class ApplyToJobService {
	constructor(
		private jobsRepository: JobsRepository,
		private jobApplicationsRepository: JobApplicationsRepository,
	) {}

	async execute(dto: ApplyToJobDTO): Promise<JobApplication> {
		const jobWithDepartment = await this.jobsRepository.findById(dto.jobId);

		if (!jobWithDepartment) {
			throw new JobNotFoundException();
		}

		const { job } = jobWithDepartment;

		if (job.isClosed()) {
			throw new JobClosedException();
		}

		const applicantEmail = Email.create(dto.applicantEmail);

		const existingApplication =
			await this.jobApplicationsRepository.findByApplicantEmailAndJobId(
				applicantEmail.toString(),
				dto.jobId,
			);

		if (existingApplication) {
			throw new JobApplicationAlreadySubmittedException();
		}

		const jobApplication = JobApplication.create({
			email: applicantEmail.toString(),
			firstName: dto.applicantFirstName.trim(),
			lastName: dto.applicantLastName.trim(),
			phone: dto.applicantPhone?.trim(),
			resumeURL: dto.applicantResumeUrl?.trim(),
			jobId: dto.jobId,
			status: "PENDING",
		});

		const createdJobApplication =
			await this.jobApplicationsRepository.create(jobApplication);

		return createdJobApplication;
	}
}
