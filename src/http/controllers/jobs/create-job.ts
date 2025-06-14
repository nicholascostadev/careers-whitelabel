import { ExceptionSchema } from "@/exceptions/exceptionSchema.js";
import { JobDtoSchema } from "@/lib/dtos/job.js";
import { makeCreateJobService } from "@/services/factories/make-create-job-service.js";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const CreateJobBodySchema = z.object({
	title: z.string().min(1),
	descriptionMarkdown: z.string().min(1),
	departmentId: z.string().min(1),
	country: z.string().min(1),
	city: z.string().min(1),
	workplaceLocation: z.enum(WorkplaceLocation),
	employmentType: z.enum(EmploymentType),
	salaryMin: z.number().optional(),
	salaryMax: z.number().optional(),
	status: z.enum(JobStatus).optional(),
	tags: z.array(z.string()).optional(),
});

type CreateJobBody = z.infer<typeof CreateJobBodySchema>;

export const CreateJobResponseSchema = {
	201: z.object({
		job: JobDtoSchema,
	}),
	400: ExceptionSchema,
	401: ExceptionSchema,
};

type CreateJobReplyType = {
	[statusCode in keyof typeof CreateJobResponseSchema]: z.infer<
		(typeof CreateJobResponseSchema)[statusCode]
	>;
};

export type CreateJobRequest = FastifyRequest<{
	Body: CreateJobBody;
	Reply: CreateJobReplyType;
}>;

export type CreateJobReply = FastifyReply<{
	Reply: CreateJobReplyType;
}>;

export async function createJobController(
	request: CreateJobRequest,
	reply: CreateJobReply,
) {
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
	} = request.body;

	const createJobService = makeCreateJobService();

	const job = await createJobService.execute({
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
	});

	return reply.status(201).send({
		job,
	});
}
