import { Department as DepartmentModel } from "@/models/index.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository.js";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { CreateJobService } from "./create-job.js";

describe("Create Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let createJobService: CreateJobService;
	let department: DepartmentModel;

	beforeEach(async () => {
		departmentsRepository = new InMemoryDepartmentsRepository();
		jobsRepository = new InMemoryJobsRepository(departmentsRepository);
		createJobService = new CreateJobService(
			jobsRepository,
			departmentsRepository,
		);

		const createdDepartment = DepartmentModel.create({
			name: "Software Engineering",
		});
		department = await departmentsRepository.create(createdDepartment);
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
			if (jobsRepository.items[0]) {
				expect(jobsRepository.items[0].job).toEqual(
					expect.objectContaining({
						id: job.id,
						title: "Software Engineer",
						descriptionMarkdown: "Software Engineer description",
						status: JobStatus.OPEN,
					}),
				);
			}
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
				status: JobStatus.CLOSED,
			});

			expect(job.status).toBe(JobStatus.CLOSED);
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
				tags: jobTags,
			});

			expect(job).toEqual(
				expect.objectContaining({
					tags: expect.arrayContaining(
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

			expect(job.status).toBe(JobStatus.OPEN);
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
					tags: [],
				}),
			);
		});
	});
});
