import { JobApplicationAlreadySubmittedException } from "@/exceptions/job-application-already-submitted-exception";
import { JobClosedException } from "@/exceptions/job-closed-exception";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository";
import { InMemoryJobApplicationsRepository } from "@/repositories/in-memory/in-memory-job-applications-repository";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { ApplyToJobService } from "./apply-to-job";

describe("Apply to Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let jobApplicationsRepository: InMemoryJobApplicationsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
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
		departmentsRepository = new InMemoryDepartmentsRepository();
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
		const department = await departmentsRepository.create({
			name: "Software Engineering",
		});

		const job = await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			departmentId: department.id,
			workplaceLocation: WorkplaceLocation.REMOTE,
			employmentType: EmploymentType.FULL_TIME,
			status: JobStatus.OPEN,
			country: "Brazil",
			city: "São Paulo",
			zipCode: "01001-000",
			jobTags: ["typescript", "node"],
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

	it("should not be able to apply to a closed job", async () => {
		const department = await departmentsRepository.create({
			name: "Software Engineering",
		});

		const job = await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			departmentId: department.id,
			workplaceLocation: WorkplaceLocation.REMOTE,
			employmentType: EmploymentType.FULL_TIME,
			status: JobStatus.CLOSED,
			country: "Brazil",
			city: "São Paulo",
			zipCode: "01001-000",
			jobTags: ["typescript", "node"],
		});

		await expect(
			applyToJobService.execute({
				jobId: job.id,
				...user,
			}),
		).rejects.toThrow(JobClosedException);
	});

	it("should be able to apply to a job", async () => {
		const department = await departmentsRepository.create({
			name: "Software Engineering",
		});

		const job = await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			departmentId: department.id,
			workplaceLocation: WorkplaceLocation.REMOTE,
			employmentType: EmploymentType.FULL_TIME,
			status: JobStatus.OPEN,
			country: "Brazil",
			city: "São Paulo",
			zipCode: "01001-000",
			jobTags: ["typescript", "node"],
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
