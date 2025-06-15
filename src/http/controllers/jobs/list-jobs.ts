import { DepartmentDtoSchema } from "@/lib/dtos/department.js";
import { JobDtoSchema } from "@/lib/dtos/job.js";
import type { ListJobsDTO } from "@/lib/dtos/list-jobs.dto.js";
import { makeListJobsService } from "@/services/factories/make-list-jobs-service.js";
import { EmploymentType, WorkplaceLocation } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const ListJobsQuerySchema = z.object({
	page: z.coerce.number().optional().default(1),
	departmentName: z.string().optional(),
	jobTitle: z.string().optional(),
	salaryMin: z.coerce.number().optional(),
	salaryMax: z.coerce.number().optional(),
	workplaceLocation: z.enum(WorkplaceLocation).optional(),
	employmentType: z.enum(EmploymentType).optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

type ListJobsQuery = z.infer<typeof ListJobsQuerySchema>;

export const ListJobsResponseSchema = {
	200: z.object({
		jobs: z.array(
			JobDtoSchema.extend({
				department: DepartmentDtoSchema,
			}),
		),
		page: z.number(),
		totalCount: z.number(),
		totalPages: z.number(),
	}),
};

type ListJobsReplyType = {
	[statusCode in keyof typeof ListJobsResponseSchema]: z.infer<
		(typeof ListJobsResponseSchema)[statusCode]
	>;
};

export type ListJobsRequest = FastifyRequest<{
	Querystring: ListJobsQuery;
	Reply: ListJobsReplyType;
}>;

export type ListJobsReply = FastifyReply<{
	Reply: ListJobsReplyType;
}>;

export async function listJobsController(
	request: ListJobsRequest,
	reply: ListJobsReply,
) {
	const {
		page,
		departmentName,
		jobTitle,
		salaryMin,
		salaryMax,
		workplaceLocation,
		employmentType,
		country,
		city,
		tags,
	} = request.query;

	const listJobsDTO: ListJobsDTO = {
		page,
		departmentName,
		jobTitle,
		salaryMin,
		salaryMax,
		workplaceLocation,
		employmentType,
		country,
		city,
		tags,
	};

	const listJobsService = makeListJobsService();

	const { jobs, totalCount, totalPages } =
		await listJobsService.execute(listJobsDTO);

	const jobsWithDepartments = jobs.map(({ job, department }) => {
		return {
			...job.toData(),
			department: department.toData(),
		};
	});

	return reply.status(200).send({
		jobs: jobsWithDepartments,
		page,
		totalCount,
		totalPages,
	});
}
