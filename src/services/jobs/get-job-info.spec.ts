import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import { Department, Job, type JobData } from "@/models/index.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository.js";
import { randomUUID } from "node:crypto";
import { GetJobInfoService } from "./get-job-info.js";

describe("GetJobInfoService", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let getJobInfoService: GetJobInfoService;
	let defaultDepartment: Department;

	beforeEach(async () => {
		departmentsRepository = new InMemoryDepartmentsRepository();
		jobsRepository = new InMemoryJobsRepository(departmentsRepository);
		getJobInfoService = new GetJobInfoService(jobsRepository);
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
			tags: [
				{ id: randomUUID(), name: "typescript" },
				{ id: randomUUID(), name: "react" },
			],
			...override,
		};
		const job = Job.create(jobData);
		return jobsRepository.create(job);
	};

	it("should return job info for a valid job id", async () => {
		const job = await createDefaultJob();

		const result = await getJobInfoService.execute(job.id);

		expect(result.job.id).toBe(job.id);
		expect(result.job.title).toBe("Software Engineer");
		expect(result.job.descriptionMarkdown).toBe(
			"Software Engineer description",
		);
		expect(result.job.departmentId).toBe(defaultDepartment.id);
		expect(result.job.country).toBe("United States");
		expect(result.job.city).toBe("New York");
		expect(result.job.workplaceLocation).toBe("ON_SITE");
		expect(result.job.employmentType).toBe("FULL_TIME");
		expect(result.job.status).toBe("OPEN");
		expect(result.job.tags.map((t) => t.name)).toEqual(["typescript", "react"]);
	});

	it("should throw JobNotFoundException if job does not exist", async () => {
		await expect(getJobInfoService.execute("non-existent-id")).rejects.toThrow(
			JobNotFoundException,
		);
	});
});
