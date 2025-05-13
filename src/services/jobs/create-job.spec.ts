import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository";
import {
	type Department,
	EmploymentType,
	JobStatus,
	WorkplaceLocation,
} from "@prisma/client";
import { InMemoryJobsRepository } from "../../repositories/in-memory/in-memory-jobs-repository";
import { CreateJobService } from "./create-job";

describe("Create Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let createJobService: CreateJobService;
	let department: Department;

	beforeEach(async () => {
		jobsRepository = new InMemoryJobsRepository();
		departmentsRepository = new InMemoryDepartmentsRepository();
		createJobService = new CreateJobService(jobsRepository);

		department = await departmentsRepository.create({
			name: "Software Engineering",
		});
	});

	describe("required fields", () => {
		it("should create a job with required fields only", async () => {
			const job = await createJobService.execute({
				title: "Software Engineer",
				descriptionMarkdown: "Software Engineer description",
				departmentId: department.id,
				country: "United States",
				city: "New York",
				workplaceLocation: WorkplaceLocation.ON_SITE,
				employmentType: EmploymentType.FULL_TIME,
			});

			expect(job).toBeDefined();
			expect(jobsRepository.items).toHaveLength(1);
			expect(jobsRepository.items[0]).toEqual(
				expect.objectContaining({
					id: job.id,
					title: "Software Engineer",
					descriptionMarkdown: "Software Engineer description",
					jobStatus: JobStatus.OPEN,
				}),
			);
		});
	});

	describe("optional fields", () => {
		it("should create a job with salary range", async () => {
			const job = await createJobService.execute({
				title: "Senior Engineer",
				descriptionMarkdown: "Senior position",
				departmentId: department.id,
				country: "United States",
				city: "San Francisco",
				workplaceLocation: WorkplaceLocation.HYBRID,
				employmentType: EmploymentType.FULL_TIME,
				salaryMin: 120000,
				salaryMax: 180000,
			});

			expect(job).toEqual(
				expect.objectContaining({
					salaryMin: 120000,
					salaryMax: 180000,
				}),
			);
		});

		it("should create a job with custom status", async () => {
			const job = await createJobService.execute({
				title: "Product Manager",
				descriptionMarkdown: "PM role",
				departmentId: department.id,
				country: "United States",
				city: "Miami",
				workplaceLocation: WorkplaceLocation.REMOTE,
				employmentType: EmploymentType.FULL_TIME,
				jobStatus: JobStatus.CLOSED,
			});

			expect(job.jobStatus).toBe(JobStatus.CLOSED);
		});

		it("should create a job with tags", async () => {
			const jobTags = ["typescript", "react", "node"];
			const job = await createJobService.execute({
				title: "Frontend Developer",
				descriptionMarkdown: "Frontend position",
				departmentId: department.id,
				country: "United States",
				city: "Austin",
				workplaceLocation: WorkplaceLocation.ON_SITE,
				employmentType: EmploymentType.CONTRACTOR,
				jobTags,
			});

			expect(job).toEqual(
				expect.objectContaining({
					jobTags: expect.arrayContaining(
						jobTags.map((tag) => expect.objectContaining({ name: tag })),
					),
				}),
			);
		});
	});

	describe("default values", () => {
		it("should set default job status to OPEN when not provided", async () => {
			const job = await createJobService.execute({
				title: "DevOps Engineer",
				descriptionMarkdown: "DevOps position",
				departmentId: department.id,
				country: "United States",
				city: "Seattle",
				workplaceLocation: WorkplaceLocation.HYBRID,
				employmentType: EmploymentType.FULL_TIME,
			});

			expect(job.jobStatus).toBe(JobStatus.OPEN);
		});

		it("should set default job tags to empty array when not provided", async () => {
			const job = await createJobService.execute({
				title: "QA Engineer",
				descriptionMarkdown: "QA position",
				departmentId: department.id,
				country: "United States",
				city: "Boston",
				workplaceLocation: WorkplaceLocation.ON_SITE,
				employmentType: EmploymentType.FULL_TIME,
			});

			expect(job).toEqual(
				expect.objectContaining({
					jobTags: [],
				}),
			);
		});
	});
});
