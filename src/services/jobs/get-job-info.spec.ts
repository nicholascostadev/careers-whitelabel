import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository.js";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { GetJobInfoService } from "./get-job-info.js";

describe("GetJobInfoService", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let getJobInfoService: GetJobInfoService;

	beforeEach(() => {
		departmentsRepository = new InMemoryDepartmentsRepository();
		jobsRepository = new InMemoryJobsRepository(departmentsRepository);
		getJobInfoService = new GetJobInfoService(jobsRepository);
	});

	const createDefaultJob = async (override = {}) => {
		// Ensure department exists
		await departmentsRepository.create({
			id: "1",
			name: "Engineering",
		});

		return jobsRepository.create({
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer description",
			departmentName: "Engineering",
			country: "United States",
			city: "New York",
			workplaceLocation: WorkplaceLocation.ON_SITE,
			employmentType: EmploymentType.FULL_TIME,
			status: JobStatus.OPEN,
			tags: ["typescript", "react"],
			...override,
		});
	};

	it("should return job info for a valid job id", async () => {
		const job = await createDefaultJob();

		const result = await getJobInfoService.execute(job.id);

		expect(result.job).toEqual(
			expect.objectContaining({
				id: job.id,
				title: "Software Engineer",
				descriptionMarkdown: "Software Engineer description",
				departmentId: "1",
				country: "United States",
				city: "New York",
				workplaceLocation: WorkplaceLocation.ON_SITE,
				employmentType: EmploymentType.FULL_TIME,
				status: JobStatus.OPEN,
				tags: expect.arrayContaining([
					expect.objectContaining({ name: "typescript" }),
					expect.objectContaining({ name: "react" }),
				]),
			}),
		);
	});

	it("should throw JobNotFoundException if job does not exist", async () => {
		await expect(getJobInfoService.execute("non-existent-id")).rejects.toThrow(
			JobNotFoundException,
		);
	});
});
