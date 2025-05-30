import { JobNotFoundException } from "@/exceptions/job-not-found-exception";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { UpdateJobService } from "./update-job";

describe("Update Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let updateJobService: UpdateJobService;

	beforeEach(() => {
		jobsRepository = new InMemoryJobsRepository();
		updateJobService = new UpdateJobService(jobsRepository);
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
			jobStatus: JobStatus.OPEN,
			salaryMin: 50000,
			salaryMax: 100000,
			jobTags: ["javascript", "react"],
			zipCode: "10001",
			...override,
		});
	};

	describe("error handling", () => {
		it("should throw JobNotFoundException when job does not exist", async () => {
			await expect(
				updateJobService.execute({
					id: "non-existent-id",
					title: "Updated Title",
				}),
			).rejects.toThrow(JobNotFoundException);
		});
	});

	describe("basic updates", () => {
		it("should update job title", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				title: "Senior Software Engineer",
			});

			expect(updatedJob.title).toBe("Senior Software Engineer");
			// Other fields should remain unchanged
			expect(updatedJob.descriptionMarkdown).toBe(
				"Software Engineer description",
			);
		});

		it("should update job description", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				descriptionMarkdown: "Updated description",
			});

			expect(updatedJob.descriptionMarkdown).toBe("Updated description");
			expect(updatedJob.title).toBe("Software Engineer");
		});

		it("should update multiple fields at once", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				title: "Senior Developer",
				descriptionMarkdown: "New description",
				country: "Canada",
				city: "Toronto",
			});

			expect(updatedJob).toEqual(
				expect.objectContaining({
					title: "Senior Developer",
					descriptionMarkdown: "New description",
					country: "Canada",
					city: "Toronto",
				}),
			);
		});
	});

	describe("salary updates", () => {
		it("should update salary range", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				salaryMin: 60000,
				salaryMax: 120000,
			});

			expect(updatedJob.salaryMin).toBe(60000);
			expect(updatedJob.salaryMax).toBe(120000);
		});

		it("should allow setting salary fields to null", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				salaryMin: null,
				salaryMax: null,
			});

			expect(updatedJob.salaryMin).toBeNull();
			expect(updatedJob.salaryMax).toBeNull();
		});

		it("should not update salary fields when undefined", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				title: "Updated Title",
				// salaryMin and salaryMax are undefined
			});

			expect(updatedJob.salaryMin).toBe(50000);
			expect(updatedJob.salaryMax).toBe(100000);
		});
	});

	describe("location and type updates", () => {
		it("should update workplace location", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				workplaceLocation: WorkplaceLocation.REMOTE,
			});

			expect(updatedJob.workplaceLocation).toBe(WorkplaceLocation.REMOTE);
		});

		it("should update employment type", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				employmentType: EmploymentType.CONTRACTOR,
			});

			expect(updatedJob.employmentType).toBe(EmploymentType.CONTRACTOR);
		});

		it("should update location fields", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				country: "Canada",
				city: "Vancouver",
				zipCode: "V6B 1A1",
			});

			expect(updatedJob).toEqual(
				expect.objectContaining({
					country: "Canada",
					city: "Vancouver",
					zipCode: "V6B 1A1",
				}),
			);
		});

		it("should allow setting zipCode to null", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				zipCode: null,
			});

			expect(updatedJob.zipCode).toBeNull();
		});
	});

	describe("tags and status updates", () => {
		it("should update job tags", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				jobTags: ["typescript", "node"],
			});

			expect(updatedJob.jobTags).toEqual([
				expect.objectContaining({ name: "typescript" }),
				expect.objectContaining({ name: "node" }),
			]);
		});

		it("should update job status", async () => {
			const job = await createDefaultJob();

			const updatedJob = await updateJobService.execute({
				id: job.id,
				jobStatus: JobStatus.CLOSED,
			});

			expect(updatedJob.jobStatus).toBe(JobStatus.CLOSED);
		});
	});
});
