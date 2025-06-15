import { JobApplicationAlreadySubmittedException } from "@/exceptions/job-application-already-submitted-exception.js";
import { JobClosedException } from "@/exceptions/job-closed-exception.js";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { ApplyToJobDTO } from "@/lib/dtos/apply-to-job.dto.js";
import { Email, Job, JobApplication } from "@/models/index.js";
import type { JobApplicationsRepository } from "@/repositories/job-application-repository.js";
import type { JobsRepository } from "@/repositories/jobs-repository.js";

export class ApplyToJobService {
	constructor(
		private jobsRepository: JobsRepository,
		private jobApplicationsRepository: JobApplicationsRepository,
	) {}

	async execute(dto: ApplyToJobDTO): Promise<JobApplication> {
		const jobData = await this.jobsRepository.findById(dto.jobId);

		if (!jobData) {
			throw new JobNotFoundException();
		}

		const job = Job.fromData({
			id: jobData.id,
			title: jobData.title,
			descriptionMarkdown: jobData.descriptionMarkdown,
			workplaceLocation: jobData.workplaceLocation,
			country: jobData.country,
			city: jobData.city,
			zipCode: jobData.zipCode ?? undefined,
			employmentType: jobData.employmentType,
			salaryMin: jobData.salaryMin ?? undefined,
			salaryMax: jobData.salaryMax ?? undefined,
			status: jobData.status,
			departmentId: jobData.departmentId,
			tags: jobData.tags || [],
			createdAt: jobData.createdAt,
			updatedAt: jobData.updatedAt,
		});

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
