import { InMemoryJobsRepository } from "../../repositories/in-memory/in-memory-jobs-repository";
import { CreateJobService } from "./create-job";

describe("Create Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let createJobService: CreateJobService;

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		createJobService = new CreateJobService(jobsRepository);
	});

	it("should be able to create a job", async () => {
		const job = await createJobService.execute({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
		});

		expect(job).toBeDefined();
		expect(jobsRepository.items).toHaveLength(1);
		expect(jobsRepository.items).toEqual([
			expect.objectContaining({
				id: job.id,
				title: "Software Engineer",
				descriptionMarkdown: "Software Engineer",
			}),
		]);
	});
});
