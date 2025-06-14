import { JobDtoSchema } from "@/lib/dtos/job.js";
import { makeUpdateJobService } from "@/services/factories/make-update-job-service.js";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const UpdateJobParamsSchema = z.object({
	id: z.string(),
});

type UpdateJobParams = z.infer<typeof UpdateJobParamsSchema>;

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

type UpdateJobBody = z.infer<typeof UpdateJobBodySchema>;

export const UpdateJobResponseSchema = {
	200: z.object({
		job: JobDtoSchema,
	}),
};

type UpdateJobReplyType = {
	[statusCode in keyof typeof UpdateJobResponseSchema]: z.infer<
		(typeof UpdateJobResponseSchema)[statusCode]
	>;
};

export type UpdateJobRequest = FastifyRequest<{
	Params: UpdateJobParams;
	Body: UpdateJobBody;
	Reply: UpdateJobReplyType;
}>;

export type UpdateJobReply = FastifyReply<{
	Reply: UpdateJobReplyType;
}>;

export async function updateJobController(
	request: UpdateJobRequest,
	reply: UpdateJobReply,
) {
	const { id } = request.params;
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
	} = request.body;

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

	return reply.status(200).send({ job });
}
