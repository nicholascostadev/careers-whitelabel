import { makeUpdateJobService } from "@/services/factories/make-update-job-service";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const UpdateJobParamsSchema = z.object({
	id: z.string(),
});

export const UpdateJobBodySchema = z.object({
	title: z.string().optional(),
	descriptionMarkdown: z.string().optional(),
	departmentId: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	workplaceLocation: z.nativeEnum(WorkplaceLocation).optional(),
	employmentType: z.nativeEnum(EmploymentType).optional(),
	salaryMin: z.number().optional(),
	salaryMax: z.number().optional(),
	status: z.nativeEnum(JobStatus).optional(),
	tags: z.array(z.string()).optional(),
	zipCode: z.string().optional(),
});

export async function updateJobController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { id } = UpdateJobParamsSchema.parse(request.params);
	const {
		title,
		descriptionMarkdown,
		departmentId,
		country,
		city,
		workplaceLocation,
		employmentType,
		salaryMin,
		salaryMax,
		status,
		tags,
		zipCode,
	} = UpdateJobBodySchema.parse(request.body);

	const updateJobService = makeUpdateJobService();

	const job = await updateJobService.execute({
		id,
		title,
		descriptionMarkdown,
		departmentId,
		country,
		city,
		workplaceLocation,
		employmentType,
		salaryMin,
		salaryMax,
		status,
		tags,
		zipCode,
	});

	return reply.status(200).send({
		job,
	});
}
