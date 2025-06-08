import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { ListJobsService } from "./list-jobs";

describe("List Jobs Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let listJobsService: ListJobsService;

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		listJobsService = new ListJobsService(jobsRepository);
	});

	const createDefaultJob = async (override = {}) => {
		return jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer description",
			departmentId: "1",
			country: "United States",
			city: "New York",
			workplaceLocation: WorkplaceLocation.ON_SITE,
			employmentType: EmploymentType.FULL_TIME,
			status: JobStatus.OPEN,
			tags: [],
			...override,
		});
	};

	describe("basic filtering", () => {
		it("should be able to list jobs by basic filters", async () => {
			await createDefaultJob();

			const { jobs, totalCount } = await listJobsService.execute({
				departmentId: "1",
				jobTitle: "Software Engineer",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(totalCount).toBe(1);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					title: "Software Engineer",
					departmentId: "1",
				}),
			);
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
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					title: "Software Engineer",
				}),
			);
		});

		it("should be able to list jobs by department", async () => {
			await createDefaultJob();
			await createDefaultJob({ departmentId: "2" });

			const { jobs, totalCount } = await listJobsService.execute({
				departmentId: "1",
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(totalCount).toBe(1);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					departmentId: "1",
				}),
			);
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
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					salaryMin: 90000,
					salaryMax: 120000,
				}),
			);
		});

		it("should filter jobs by workplace location", async () => {
			await createDefaultJob();
			await createDefaultJob({ workplaceLocation: WorkplaceLocation.REMOTE });

			const { jobs } = await listJobsService.execute({
				workplaceLocation: WorkplaceLocation.REMOTE,
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					workplaceLocation: WorkplaceLocation.REMOTE,
				}),
			);
		});

		it("should filter jobs by employment type", async () => {
			await createDefaultJob();
			await createDefaultJob({ employmentType: EmploymentType.CONTRACTOR });

			const { jobs } = await listJobsService.execute({
				employmentType: EmploymentType.CONTRACTOR,
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					employmentType: EmploymentType.CONTRACTOR,
				}),
			);
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
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					country: "Canada",
					city: "Toronto",
				}),
			);
		});

		it("should filter jobs by tags", async () => {
			await createDefaultJob({ tags: ["react", "typescript"] });
			await createDefaultJob({ tags: ["python", "django"] });

			const { jobs } = await listJobsService.execute({
				tags: ["react"],
				page: 1,
			});

			expect(jobs).toHaveLength(1);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					tags: expect.arrayContaining([
						expect.objectContaining({ name: "react" }),
					]),
				}),
			);
		});
	});

	describe("pagination", () => {
		it("should return correct items for first page", async () => {
			for (let i = 0; i < 22; i++) {
				await createDefaultJob({
					title: `Software Engineer ${i}`,
					descriptionMarkdown: `Software Engineer ${i}`,
				});
			}

			const { jobs, totalCount } = await listJobsService.execute({
				page: 1,
			});

			expect(jobs).toHaveLength(10);
			expect(totalCount).toBe(22);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					title: "Software Engineer 0",
				}),
			);
			expect(jobs[9]).toEqual(
				expect.objectContaining({
					title: "Software Engineer 9",
				}),
			);
		});

		it("should return correct items for second page", async () => {
			for (let i = 0; i < 12; i++) {
				await createDefaultJob({
					title: `Software Engineer ${i}`,
					descriptionMarkdown: `Software Engineer ${i}`,
				});
			}

			const { jobs, totalCount } = await listJobsService.execute({
				page: 2,
			});

			expect(jobs).toHaveLength(2);
			expect(totalCount).toBe(12);
			expect(jobs[0]).toEqual(
				expect.objectContaining({
					title: "Software Engineer 10",
				}),
			);
			expect(jobs[1]).toEqual(
				expect.objectContaining({
					title: "Software Engineer 11",
				}),
			);
		});

		it("should return empty array when page exceeds available items", async () => {
			await createDefaultJob();

			const { jobs, totalCount } = await listJobsService.execute({
				page: 3,
			});

			expect(jobs).toHaveLength(0);
			expect(totalCount).toBe(1);
		});
	});
});
