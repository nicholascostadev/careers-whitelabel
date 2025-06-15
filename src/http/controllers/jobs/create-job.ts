import { ExceptionSchema } from "@/exceptions/exceptionSchema.js";
import {
	type CreateJobDto,
	CreateJobDtoSchema,
} from "@/lib/dtos/create-job.dto.js";
import { JobDtoSchema } from "@/lib/dtos/job.js";
import { makeCreateJobService } from "@/services/factories/make-create-job-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const CreateJobBodySchema = CreateJobDtoSchema;

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
	const dto: CreateJobDto = request.body;

	const createJobService = makeCreateJobService();
	const createdJob = await createJobService.execute(dto);

	return reply.status(201).send({
		job: createdJob,
	});
}
