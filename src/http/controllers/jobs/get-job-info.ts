import { ExceptionSchema } from "@/exceptions/exceptionSchema.js";
import { DepartmentDtoSchema } from "@/lib/dtos/department.js";
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
		job: JobDtoSchema.extend({
			department: DepartmentDtoSchema,
		}),
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

	const { job, department } = await getJobInfoService.execute(id);

	const response = {
		...job.toData(),
		department: department.toData(),
	};

	return reply.status(200).send({
		job: response,
	});
}
