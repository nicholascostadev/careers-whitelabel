import { ExceptionSchema } from "@/exceptions/exceptionSchema.js";
import { JobDtoSchema } from "@/lib/dtos/job.js";
import { makeGetJobInfoService } from "@/services/factories/make-get-job-info-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod/v4";

export const GetJobInfoParamsSchema = z.object({
	id: z.uuid(),
});

type GetJobInfoParams = z.infer<typeof GetJobInfoParamsSchema>;

export const GetJobInfoResponseSchema = {
	200: z.object({
		job: JobDtoSchema,
	}),
	404: ExceptionSchema,
};

type GetJobInfoReplyType = {
	[statusCode in keyof typeof GetJobInfoResponseSchema]: z.infer<
		(typeof GetJobInfoResponseSchema)[statusCode]
	>;
};

export type GetJobInfoRequest = FastifyRequest<{
	Params: GetJobInfoParams;
	Reply: GetJobInfoReplyType;
}>;

export type GetJobInfoReply = FastifyReply<{
	Reply: GetJobInfoReplyType;
}>;
export async function getJobInfoController(
	request: GetJobInfoRequest,
	reply: GetJobInfoReply,
) {
	const { id } = request.params;

	const getJobInfoService = makeGetJobInfoService();

	const { job } = await getJobInfoService.execute(id);

	return reply.status(200).send({
		job,
	});
}
