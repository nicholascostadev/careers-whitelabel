import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { GetJobInfoService } from "./get-job-info";

describe("GetJobInfoService", () => {
	let jobsRepository: InMemoryJobsRepository;
	let getJobInfoService: GetJobInfoService;

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		getJobInfoService = new GetJobInfoService(jobsRepository);
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
