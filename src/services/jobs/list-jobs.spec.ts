import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository";
import { ListJobsService } from "./list-jobs";

describe("List Jobs Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let listJobsService: ListJobsService;

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		listJobsService = new ListJobsService(jobsRepository);
	});

	it("should be able to list jobs", async () => {
		await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			organizationId: "1",
			departmentId: "1",
		});

		const { jobs, totalCount } = await listJobsService.execute({
			departmentId: "1",
			jobTitle: "Software Engineer",
			page: 1,
		});

		expect(jobs).toHaveLength(1);
		expect(totalCount).toBe(1);
	});

	it("should be able to list jobs with pagination", async () => {
		for (let i = 0; i < 22; i++) {
			await jobsRepository.create({
				title: `Software Engineer ${i}`,
				descriptionMarkdown: `Software Engineer ${i}`,
				organizationId: "1",
				departmentId: "1",
			});
		}

		const { jobs, totalCount } = await listJobsService.execute({
			departmentId: "1",
			jobTitle: "Software Engineer",
			page: 1,
		});

		expect(jobs).toHaveLength(10);
		expect(totalCount).toBe(22);
	});

	it("should be able to list jobs with pagination on page 2", async () => {
		for (let i = 0; i < 12; i++) {
			await jobsRepository.create({
				title: `Software Engineer ${i}`,
				descriptionMarkdown: `Software Engineer ${i}`,
				organizationId: "1",
				departmentId: "1",
			});
		}

		const { jobs, totalCount } = await listJobsService.execute({
			departmentId: "1",
			jobTitle: "Software Engineer",
			page: 2,
		});

		expect(jobs).toHaveLength(2);
		expect(totalCount).toBe(12);
	});

	it("should be able to list jobs by job title", async () => {
		await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			organizationId: "1",
			departmentId: "1",
		});

		await jobsRepository.create({
			title: "Full Stack Engineer",
			descriptionMarkdown: "Full Stack Engineer",
			organizationId: "1",
			departmentId: "1",
		});

		const { jobs, totalCount } = await listJobsService.execute({
			jobTitle: "Software Engineer",
			page: 1,
		});

		expect(jobs).toHaveLength(1);
		expect(totalCount).toBe(1);
	});

	it("should be able to list jobs by department", async () => {
		await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			organizationId: "1",
			departmentId: "1",
		});

		await jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			organizationId: "1",
			departmentId: "2",
		});

		const { jobs, totalCount } = await listJobsService.execute({
			departmentId: "1",
			page: 1,
		});

		expect(jobs).toHaveLength(1);
		expect(totalCount).toBe(1);
	});
});
