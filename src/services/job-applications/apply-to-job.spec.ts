import { JobApplicationAlreadySubmittedException } from "@/exceptions/job-application-already-submitted";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import { InMemoryJobApplicationsRepository } from "@/repositories/in-memory/in-memory-job-applications-repository";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository";
import { ApplyToJobService } from "./apply-to-job";

describe("Apply to Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let jobApplicationsRepository: InMemoryJobApplicationsRepository;
	let applyToJobService: ApplyToJobService;

	const user = {
		applicantFirstName: "Nicholas",
		applicantLastName: "Costa",
		applicantEmail: "nicholas.costa@gmail.com",
		applicantPhone: "+55 (11) 99999-9999",
		applicantResumeUrl: "https://www.google.com",
	};

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		jobApplicationsRepository = new InMemoryJobApplicationsRepository();
		applyToJobService = new ApplyToJobService(
			jobsRepository,
			jobApplicationsRepository,
		);
	});

	it("should not be able to apply to a non-existent job", async () => {
		await expect(
			applyToJobService.execute({
				jobId: "non-existent-job-id",
				...user,
			}),
		).rejects.toThrow(JobNotFoundException);
	});

	it("should not be able to apply to a job with the same email", async () => {
		const job = await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			organizationId: "organization-id",
		});

		await applyToJobService.execute({
			jobId: job.id,
			...user,
		});

		await expect(
			applyToJobService.execute({
				jobId: job.id,
				...user,
			}),
		).rejects.toThrow(JobApplicationAlreadySubmittedException);
	});

	it("should be able to apply to a job", async () => {
		const job = await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			organizationId: "organization-id",
		});

		const jobApplication = await applyToJobService.execute({
			jobId: job.id,
			...user,
		});

		expect(jobApplication).toBeDefined();
		expect(jobApplicationsRepository.items).toHaveLength(1);
		expect(jobApplicationsRepository.items[0]?.id).toBe(jobApplication.id);
	});
});
