import { db } from "@/lib/infra/database.js";
import { Job } from "@/models/index.js";
import type {
	FindManyJobsRequest,
	JobsRepository,
	ListJobsResponse,
} from "../jobs-repository.js";

export class PrismaJobsRepository implements JobsRepository {
	async create(job: Job): Promise<Job> {
		// Convert domain model to Prisma format
		const savedJob = await db.job.create({
			data: {
				id: job.id,
				title: job.title,
				city: job.city,
				country: job.country,
				descriptionMarkdown: job.descriptionMarkdown,
				employmentType: job.employmentType,
				workplaceLocation: job.workplaceLocation,
				departmentId: job.departmentId,
				salaryMin: job.salaryMin,
				salaryMax: job.salaryMax,
				zipCode: job.zipCode,
				status: job.status,
				tags: {
					connectOrCreate: job.tags.map(
						(tag: { id: string; name: string }) => ({
							where: { name: tag.name },
							create: { name: tag.name },
						}),
					),
				},
				createdAt: job.createdAt,
				updatedAt: job.updatedAt,
			},
			include: {
				tags: true,
				department: true,
			},
		});

		// Convert Prisma result back to domain model
		return Job.fromData({
			id: savedJob.id,
			title: savedJob.title,
			descriptionMarkdown: savedJob.descriptionMarkdown,
			workplaceLocation: savedJob.workplaceLocation,
			country: savedJob.country,
			city: savedJob.city,
			zipCode: savedJob.zipCode ?? undefined,
			employmentType: savedJob.employmentType,
			salaryMin: savedJob.salaryMin ?? undefined,
			salaryMax: savedJob.salaryMax ?? undefined,
			status: savedJob.status,
			departmentId: savedJob.departmentId,
			tags: savedJob.tags.map((tag) => ({
				id: tag.id,
				name: tag.name,
			})),
			createdAt: savedJob.createdAt,
			updatedAt: savedJob.updatedAt,
		});
	}

	async findById(id: string): Promise<Job | null> {
		const jobData = await db.job.findUnique({
			where: {
				id,
			},
			include: {
				tags: true,
				department: true,
			},
		});

		if (!jobData) {
			return null;
		}

		// Convert Prisma result to domain model
		return Job.fromData({
			id: jobData.id,
			title: jobData.title,
			descriptionMarkdown: jobData.descriptionMarkdown,
			workplaceLocation: jobData.workplaceLocation,
			country: jobData.country,
			city: jobData.city,
			zipCode: jobData.zipCode ?? undefined,
			employmentType: jobData.employmentType,
			salaryMin: jobData.salaryMin ?? undefined,
			salaryMax: jobData.salaryMax ?? undefined,
			status: jobData.status,
			departmentId: jobData.departmentId,
			tags: jobData.tags.map((tag) => ({
				id: tag.id,
				name: tag.name,
			})),
			createdAt: jobData.createdAt,
			updatedAt: jobData.updatedAt,
		});
	}

	async findMany(
		data: FindManyJobsRequest,
		page: number,
	): Promise<ListJobsResponse> {
		console.log(data);

		const [jobsData, totalCount] = await Promise.all([
			db.job.findMany({
				where: {
					department: {
						name: data.departmentName,
					},
					title: data.jobTitle,
					salaryMin: {
						gte: data.salaryMin,
					},
					salaryMax: {
						lte: data.salaryMax,
					},
					workplaceLocation: data.workplaceLocation,
					employmentType: data.employmentType,
					country: data.country,
					city: data.city,
					tags:
						data.tags.length > 0
							? {
									some: {
										name: {
											in: data.tags,
										},
									},
								}
							: undefined,
				},
				skip: (page - 1) * 10,
				take: 10,
				include: {
					tags: true,
					department: true,
				},
			}),
			db.job.count({
				where: {
					department: {
						name: data.departmentName,
					},
					title: data.jobTitle,
					salaryMin: {
						gte: data.salaryMin,
					},
					salaryMax: {
						lte: data.salaryMax,
					},
					workplaceLocation: data.workplaceLocation,
					employmentType: data.employmentType,
					country: data.country,
					city: data.city,
					tags:
						data.tags.length > 0
							? {
									some: {
										name: {
											in: data.tags,
										},
									},
								}
							: undefined,
				},
			}),
		]);

		// Convert Prisma results to domain models
		const jobs = jobsData.map((jobData) =>
			Job.fromData({
				id: jobData.id,
				title: jobData.title,
				descriptionMarkdown: jobData.descriptionMarkdown,
				workplaceLocation: jobData.workplaceLocation,
				country: jobData.country,
				city: jobData.city,
				zipCode: jobData.zipCode ?? undefined,
				employmentType: jobData.employmentType,
				salaryMin: jobData.salaryMin ?? undefined,
				salaryMax: jobData.salaryMax ?? undefined,
				status: jobData.status,
				departmentId: jobData.departmentId,
				tags: jobData.tags.map((tag) => ({
					id: tag.id,
					name: tag.name,
				})),
				createdAt: jobData.createdAt,
				updatedAt: jobData.updatedAt,
			}),
		);

		return {
			jobs,
			totalCount,
			totalPages: Math.ceil(totalCount / 10),
		};
	}

	async update(job: Job): Promise<Job> {
		const updatedJob = await db.job.update({
			where: {
				id: job.id,
			},
			data: {
				title: job.title,
				descriptionMarkdown: job.descriptionMarkdown,
				workplaceLocation: job.workplaceLocation,
				employmentType: job.employmentType,
				country: job.country,
				city: job.city,
				zipCode: job.zipCode,
				salaryMin: job.salaryMin,
				salaryMax: job.salaryMax,
				status: job.status,
				departmentId: job.departmentId,
				updatedAt: job.updatedAt,
				tags: {
					set: [],
					connectOrCreate: job.tags.map((tag) => ({
						where: { name: tag.name },
						create: { name: tag.name },
					})),
				},
			},
			include: {
				tags: true,
				department: true,
			},
		});

		// Convert Prisma result to domain model
		return Job.fromData({
			id: updatedJob.id,
			title: updatedJob.title,
			descriptionMarkdown: updatedJob.descriptionMarkdown,
			workplaceLocation: updatedJob.workplaceLocation,
			country: updatedJob.country,
			city: updatedJob.city,
			zipCode: updatedJob.zipCode ?? undefined,
			employmentType: updatedJob.employmentType,
			salaryMin: updatedJob.salaryMin ?? undefined,
			salaryMax: updatedJob.salaryMax ?? undefined,
			status: updatedJob.status,
			departmentId: updatedJob.departmentId,
			tags: updatedJob.tags.map((tag) => ({
				id: tag.id,
				name: tag.name,
			})),
			createdAt: updatedJob.createdAt,
			updatedAt: updatedJob.updatedAt,
		});
	}
}
