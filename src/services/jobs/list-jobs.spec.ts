import { Department, Job, type JobData } from "@/models/index.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository.js";
import { randomUUID } from "node:crypto";
import { ListJobsService } from "./list-jobs.js";

describe("List Jobs Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let listJobsService: ListJobsService;
	let defaultDepartment: Department;

	beforeEach(async () => {
		departmentsRepository = new InMemoryDepartmentsRepository();
		jobsRepository = new InMemoryJobsRepository(departmentsRepository);
		listJobsService = new ListJobsService(jobsRepository);

		defaultDepartment = await departmentsRepository.create(
			Department.create({ name: "Engineering" }),
		);
	});

	const createDefaultJob = async (
		override: Partial<Omit<JobData, "id" | "createdAt" | "updatedAt">> = {},
	) => {
		const jobData: Omit<JobData, "id" | "createdAt" | "updatedAt"> = {
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer description",
			departmentId: defaultDepartment.id,
			country: "United States",
			city: "New York",
			workplaceLocation: "ON_SITE",
			employmentType: "FULL_TIME",
			status: "OPEN",
			tags: [],
			...override,
		};

		const job = Job.create(jobData);

		return jobsRepository.create(job);
	};

	describe("basic filtering", () => {
		it("should be able to list jobs by basic filters", async () => {
			await createDefaultJob();

			const { jobs, totalCount } = await listJobsService.execute({
				departmentName: "Engineering",
				jobTitle: "Software Engineer",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(totalCount).toBe(1);
			if (jobs[0]) {
				expect(jobs[0].title).toBe("Software Engineer");
			}
			// can't test department name this way anymore, would need a join in the repo
		});

		it("should be able to list jobs by job title", async () => {
			await createDefaultJob();
			await createDefaultJob({ title: "Full Stack Engineer" });

			const { jobs, totalCount } = await listJobsService.execute({
				jobTitle: "Software Engineer",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(totalCount).toBe(1);
			if (jobs[0]) {
				expect(jobs[0].title).toBe("Software Engineer");
			}
		});

		it("should be able to list jobs by department", async () => {
			await createDefaultJob();

			// Create second department and job
			const marketingDepartment = await departmentsRepository.create(
				Department.create({ name: "Marketing" }),
			);
			await createDefaultJob({ departmentId: marketingDepartment.id });

			const { jobs, totalCount } = await listJobsService.execute({
				departmentName: "Engineering",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(totalCount).toBe(1);
			if (jobs[0]) {
				expect(jobs[0].departmentId).toBe(defaultDepartment.id);
			}
		});
	});

	describe("advanced filtering", () => {
		it("should filter jobs by salary range", async () => {
			await createDefaultJob({ salaryMin: 50000, salaryMax: 80000 });
			await createDefaultJob({ salaryMin: 90000, salaryMax: 120000 });

			const { jobs } = await listJobsService.execute({
				salaryMin: 85000,
				salaryMax: 125000,
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			if (jobs[0]) {
				expect(jobs[0].salaryMin).toBe(90000);
				expect(jobs[0].salaryMax).toBe(120000);
			}
		});

		it("should filter jobs by workplace location", async () => {
			await createDefaultJob();
			await createDefaultJob({ workplaceLocation: "REMOTE" });

			const { jobs } = await listJobsService.execute({
				workplaceLocation: "REMOTE",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			if (jobs[0]) {
				expect(jobs[0].workplaceLocation).toBe("REMOTE");
			}
		});

		it("should filter jobs by employment type", async () => {
			await createDefaultJob();
			await createDefaultJob({ employmentType: "CONTRACTOR" });

			const { jobs } = await listJobsService.execute({
				employmentType: "CONTRACTOR",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			if (jobs[0]) {
				expect(jobs[0].employmentType).toBe("CONTRACTOR");
			}
		});

		it("should filter jobs by location", async () => {
			await createDefaultJob();
			await createDefaultJob({
				country: "Canada",
				city: "Toronto",
			});

			const { jobs } = await listJobsService.execute({
				country: "Canada",
				city: "Toronto",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			if (jobs[0]) {
				expect(jobs[0].country).toBe("Canada");
				expect(jobs[0].city).toBe("Toronto");
			}
		});

		it("should filter jobs by tags", async () => {
			await createDefaultJob({
				tags: [
					{ id: randomUUID(), name: "react" },
					{ id: randomUUID(), name: "typescript" },
				],
			});
			await createDefaultJob({
				tags: [
					{ id: randomUUID(), name: "python" },
					{ id: randomUUID(), name: "django" },
				],
			});

			const { jobs } = await listJobsService.execute({
				tags: ["react"],
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			if (jobs[0]) {
				expect(jobs[0].tags.map((t) => t.name)).toContain("react");
			}
		});
	});

	describe("pagination", () => {
		it("should return correct items for first page", async () => {
			for (let i = 0; i < 22; i++) {
				await createDefaultJob({
					title: `Software Engineer ${i}`,
				});
			}

			const { jobs, totalCount, totalPages } = await listJobsService.execute({
				page: 1,
			});

			expect(jobs).toHaveLength(10);
			expect(totalCount).toBe(22);
			expect(totalPages).toBe(3);
			if (jobs[0] && jobs[9]) {
				expect(jobs[0].title).toBe("Software Engineer 0");
				expect(jobs[9].title).toBe("Software Engineer 9");
			}
		});

		it("should return correct items for second page", async () => {
			for (let i = 0; i < 12; i++) {
				await createDefaultJob({
					title: `Software Engineer ${i}`,
				});
			}

			const { jobs, totalCount, totalPages } = await listJobsService.execute({
				page: 2,
				itemsPerPage: 10,
			});

			expect(jobs).toHaveLength(2);
			expect(totalCount).toBe(12);
			expect(totalPages).toBe(2);
			if (jobs[0] && jobs[1]) {
				expect(jobs[0].title).toBe("Software Engineer 10");
				expect(jobs[1].title).toBe("Software Engineer 11");
			}
		});

		it("should return empty array when page exceeds available items", async () => {
			await createDefaultJob();

			const { jobs, totalCount, totalPages } = await listJobsService.execute({
				page: 2,
			});

			expect(jobs).toHaveLength(0);
			expect(totalCount).toBe(1);
			expect(totalPages).toBe(1);
		});
	});
});
