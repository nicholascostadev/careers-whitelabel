import { DepartmentNotFoundException } from "@/exceptions/department-not-found.js";
import { JobNotFoundException } from "@/exceptions/job-not-found-exception.js";
import type { UpdateJobDTO } from "@/lib/dtos/update-job.dto.js";
import { Department, Job } from "@/models/index.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { InMemoryJobsRepository } from "@/repositories/in-memory/in-memory-jobs-repository.js";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { UpdateJobService } from "./update-job.js";

describe("Update Job Service", () => {
	let jobsRepository: InMemoryJobsRepository;
	let departmentsRepository: InMemoryDepartmentsRepository;
	let updateJobService: UpdateJobService;

	beforeEach(() => {
		departmentsRepository = new InMemoryDepartmentsRepository();
		jobsRepository = new InMemoryJobsRepository(departmentsRepository);
		updateJobService = new UpdateJobService(
			jobsRepository,
			departmentsRepository,
		);
	});

	const createDefaultDepartment = async (
		id = "550e8400-e29b-41d4-a716-446655440000",
		name = "Software Engineering",
	) => {
		const department = Department.fromData({ id, name });
		await departmentsRepository.create(department);
		return department;
	};

	const createDefaultJob = async (override = {}) => {
		const department = await createDefaultDepartment();

		const job = Job.fromData({
			id: "550e8400-e29b-41d4-a716-446655440001",
			title: "Software Engineer",
			descriptionMarkdown: "Software Engineer description",
			departmentId: department.id,
			country: "United States",
			city: "New York",
			workplaceLocation: WorkplaceLocation.ON_SITE,
			employmentType: EmploymentType.FULL_TIME,
			status: JobStatus.OPEN,
			salaryMin: 50000,
			salaryMax: 100000,
			tags: [
				{ id: "550e8400-e29b-41d4-a716-446655440010", name: "javascript" },
				{ id: "550e8400-e29b-41d4-a716-446655440011", name: "react" },
			],
			zipCode: "10001",
			createdAt: new Date(),
			updatedAt: new Date(),
			...override,
		});

		await jobsRepository.create(job);
		return job;
	};

	describe("error handling", () => {
		it("should throw JobNotFoundException when job does not exist", async () => {
			const updateJobDTO: UpdateJobDTO = {
				id: "non-existent-id",
				title: "Updated Title",
			};

			await expect(updateJobService.execute(updateJobDTO)).rejects.toThrow(
				JobNotFoundException,
			);
		});
	});

	describe("basic updates", () => {
		it("should update job title", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				title: "Senior Software Engineer",
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.title).toBe("Senior Software Engineer");
			// Other fields should remain unchanged
			expect(updatedJob.descriptionMarkdown).toBe(
				"Software Engineer description",
			);
		});

		it("should update job description", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				descriptionMarkdown: "Updated description",
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.descriptionMarkdown).toBe("Updated description");
			expect(updatedJob.title).toBe("Software Engineer");
		});

		it("should update multiple fields at once", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				title: "Senior Developer",
				descriptionMarkdown: "New description",
				country: "Canada",
				city: "Toronto",
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

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

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				salaryMin: 60000,
				salaryMax: 120000,
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.salaryMin).toBe(60000);
			expect(updatedJob.salaryMax).toBe(120000);
		});

		it("should not update salary fields when undefined", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				title: "Updated Title",
				// salaryMin and salaryMax are undefined
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.salaryMin).toBe(50000);
			expect(updatedJob.salaryMax).toBe(100000);
		});
	});

	describe("location and type updates", () => {
		it("should update workplace location", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				workplaceLocation: WorkplaceLocation.REMOTE,
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.workplaceLocation).toBe(WorkplaceLocation.REMOTE);
		});

		it("should update employment type", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				employmentType: EmploymentType.CONTRACTOR,
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.employmentType).toBe(EmploymentType.CONTRACTOR);
		});

		it("should update location fields", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				country: "Canada",
				city: "Vancouver",
				zipCode: "V6B 1A1",
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob).toEqual(
				expect.objectContaining({
					country: "Canada",
					city: "Vancouver",
					zipCode: "V6B 1A1",
				}),
			);
		});
	});

	describe("tags and status updates", () => {
		it("should update job tags", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				tags: ["typescript", "node"],
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.tags).toEqual([
				expect.objectContaining({ name: "typescript" }),
				expect.objectContaining({ name: "node" }),
			]);
		});

		it("should update job status", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				status: JobStatus.CLOSED,
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.status).toBe(JobStatus.CLOSED);
		});
	});

	describe("department updates", () => {
		it("should update job department", async () => {
			const job = await createDefaultJob();
			const newDepartment = await createDefaultDepartment(
				"550e8400-e29b-41d4-a716-446655440002",
				"Marketing",
			);

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				departmentId: newDepartment.id,
			};

			const updatedJob = await updateJobService.execute(updateJobDTO);

			expect(updatedJob.departmentId).toBe(newDepartment.id);
		});

		it("should not update job department if department does not exist", async () => {
			const job = await createDefaultJob();

			const updateJobDTO: UpdateJobDTO = {
				id: job.id,
				departmentId: "non-existent-department-id",
			};

			await expect(updateJobService.execute(updateJobDTO)).rejects.toThrow(
				DepartmentNotFoundException,
			);
		});
	});
});
