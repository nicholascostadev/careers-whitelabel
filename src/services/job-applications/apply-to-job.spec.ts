import { JobApplicationAlreadySubmittedException } from "@/exceptions/job-application-already-submitted-exception.js";
import { JobClosedException } from "@/exceptions/job-closed-exception.js";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import { Department, Job } from "@/models/index.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { InMemoryJobApplicationsRepository } from "@/repositories/in-memory/in-memory-job-applications-repository.js";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository.js";
import { randomUUID } from "node:crypto";
import { ApplyToJobService } from "./apply-to-job.js";

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
		departmentsRepository = new InMemoryDepartmentsRepository();
		jobsRepository = new InMemoryJobsRepository(departmentsRepository);
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
		const department = await departmentsRepository.create(
			Department.create({
				name: "Software Engineering",
			}),
		);

		const job = await jobsRepository.create(
			Job.create({
				title: "Software Engineer",
				descriptionMarkdown: "Software Engineer",
				departmentId: department.id,
				workplaceLocation: "REMOTE",
				employmentType: "FULL_TIME",
				status: "OPEN",
				country: "Brazil",
				city: "São Paulo",
				zipCode: "01001-000",
				tags: [{ id: randomUUID(), name: "typescript" }],
			}),
		);

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
		const department = await departmentsRepository.create(
			Department.create({
				name: "Software Engineering",
			}),
		);

		const job = await jobsRepository.create(
			Job.create({
				title: "Software Engineer",
				descriptionMarkdown: "Software Engineer",
				departmentId: department.id,
				workplaceLocation: "REMOTE",
				employmentType: "FULL_TIME",
				status: "CLOSED",
				country: "Brazil",
				city: "São Paulo",
				zipCode: "01001-000",
				tags: [{ id: randomUUID(), name: "typescript" }],
			}),
		);

		await expect(
			applyToJobService.execute({
				jobId: job.id,
				...user,
			}),
		).rejects.toThrow(JobClosedException);
	});

	it("should be able to apply to a job", async () => {
		const department = await departmentsRepository.create(
			Department.create({
				name: "Software Engineering",
			}),
		);

		const job = await jobsRepository.create(
			Job.create({
				title: "Software Engineer",
				descriptionMarkdown: "Software Engineer",
				departmentId: department.id,
				workplaceLocation: "REMOTE",
				employmentType: "FULL_TIME",
				status: "OPEN",
				country: "Brazil",
				city: "São Paulo",
				zipCode: "01001-000",
				tags: [{ id: randomUUID(), name: "typescript" }],
			}),
		);

		const jobApplication = await applyToJobService.execute({
			jobId: job.id,
			...user,
		});

		expect(jobApplication).toBeDefined();
		expect(jobApplicationsRepository.items).toHaveLength(1);
		expect(jobApplicationsRepository.items[0]?.id).toBe(jobApplication.id);
	});
});
