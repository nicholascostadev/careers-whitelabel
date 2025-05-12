import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository";
import { InMemoryJobsRepository } from "../../repositories/in-memory/in-memory-jobs-repository";
import { CreateJobService } from "./create-job";

describe("Create Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let createJobService: CreateJobService;

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		departmentsRepository = new InMemoryDepartmentsRepository();
		createJobService = new CreateJobService(jobsRepository);
	});

	it("should be able to create a job", async () => {
		const department = await departmentsRepository.create({
			name: "Software Engineering",
			organizationId: "organization-id",
		});

		const job = await createJobService.execute({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer",
			departmentId: department.id,
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
