import { makeListJobsService } from "@/services/factories/make-list-jobs-service";
import { EmploymentType, WorkplaceLocation } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const ListJobsQuerySchema = z.object({
	page: z.number().optional().default(1),
	departmentId: z.string().optional(),
	jobTitle: z.string().optional(),
	salaryMin: z.coerce.number().optional(),
	salaryMax: z.coerce.number().optional(),
	workplaceLocation: z.nativeEnum(WorkplaceLocation).optional(),
	employmentType: z.nativeEnum(EmploymentType).optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

export async function listJobsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const {
		page,
		departmentId,
		jobTitle,
		salaryMin,
		salaryMax,
		workplaceLocation,
		employmentType,
		country,
		city,
		tags,
	} = ListJobsQuerySchema.parse(request.query);

	const listJobsService = makeListJobsService();

	const { jobs, totalCount, totalPages } = await listJobsService.execute({
		page,
		departmentId,
		jobTitle,
		salaryMin,
		salaryMax,
		workplaceLocation,
		employmentType,
		country,
		city,
		tags,
	});

	return reply.status(200).send({
		jobs,
		page,
		totalCount,
		totalPages,
	});
}
