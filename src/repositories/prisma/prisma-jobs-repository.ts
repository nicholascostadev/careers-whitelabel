import { db } from "@/lib/infra/database";
import type {
	CreateJobRequest,
	FindManyJobsRequest,
	JobWithTags,
	JobsRepository,
	ListJobsResponse,
	UpdateJobRequest,
} from "../jobs-repository";

export class PrismaJobsRepository implements JobsRepository {
	async create(data: CreateJobRequest): Promise<JobWithTags> {
		const job = await db.job.create({
			data: {
				title: data.title,
				city: data.city,
				country: data.country,
				descriptionMarkdown: data.descriptionMarkdown,
				employmentType: data.employmentType,
				workplaceLocation: data.workplaceLocation,
				departmentId: data.departmentId,
				salaryMin: data.salaryMin,
				salaryMax: data.salaryMax,
				zipCode: data.zipCode,
				tags: {
					connectOrCreate: data.tags.map((tag) => ({
						where: { name: tag },
						create: { name: tag },
					})),
				},
			},
			include: {
				tags: true,
			},
		});

		return job;
	}

	async findById(id: string): Promise<JobWithTags | null> {
		const job = await db.job.findUnique({
			where: {
				id,
			},
			include: {
				tags: true,
			},
		});

		return job ?? null;
	}

	async findMany(
		data: FindManyJobsRequest,
		page: number,
	): Promise<ListJobsResponse> {
		console.log(data);

		const [jobs, totalCount] = await Promise.all([
			db.job.findMany({
				where: {
					departmentId: data.departmentId,
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
				},
			}),
			db.job.count({
				where: {
					departmentId: data.departmentId,
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

		return {
			jobs,
			totalCount,
			totalPages: Math.ceil(totalCount / 10),
		};
	}

	async update(id: string, data: UpdateJobRequest): Promise<JobWithTags> {
		const job = await db.job.update({
			where: {
				id,
			},
			data: {
				title: data.title,
				descriptionMarkdown: data.descriptionMarkdown,
				workplaceLocation: data.workplaceLocation,
				employmentType: data.employmentType,
				country: data.country,
				city: data.city,
				zipCode: data.zipCode,
				salaryMin: data.salaryMin,
				salaryMax: data.salaryMax,
				departmentId: data.departmentId,
				tags: {
					connectOrCreate: data.tags?.map((tag) => ({
						where: { name: tag },
						create: { name: tag },
					})),
				},
			},
			include: {
				tags: true,
			},
		});

		return job;
	}
}
