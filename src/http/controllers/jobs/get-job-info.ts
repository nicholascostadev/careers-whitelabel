import { makeGetJobInfoService } from "@/services/factories/make-get-job-info-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const GetJobInfoParamsSchema = z.object({
	id: z.string(),
});

export async function getJobInfoController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { id } = GetJobInfoParamsSchema.parse(request.params);

	const getJobInfoService = makeGetJobInfoService();

	const { job } = await getJobInfoService.execute(id);

	return reply.status(200).send({
		job,
	});
}
