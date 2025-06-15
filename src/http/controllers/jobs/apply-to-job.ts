import { ExceptionSchema } from "@/exceptions/exceptionSchema.js";
import type { ApplyToJobDTO } from "@/lib/dtos/apply-to-job.dto.js";
import { makeApplyToJobService } from "@/services/factories/make-apply-to-job-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const ApplyToJobBodyParamsSchema = z.object({
	id: z.uuid(),
});

type ApplyToJobBodyParams = z.infer<typeof ApplyToJobBodyParamsSchema>;

export const ApplyToJobBodySchema = z.object({
	applicantFirstName: z.string(),
	applicantLastName: z.string(),
	applicantEmail: z.string(),
	applicantPhone: z.string().optional(),
	applicantResumeUrl: z.string().optional(),
});

type ApplyToJobBody = z.infer<typeof ApplyToJobBodySchema>;

export const ApplyToJobResponseSchema = {
	201: z.object({
		jobApplication: z.object({
			id: z.string(),
			jobId: z.string(),
		}),
	}),
	400: ExceptionSchema,
	404: ExceptionSchema,
	409: ExceptionSchema,
};

type ApplyToJobReplyType = {
	[statusCode in keyof typeof ApplyToJobResponseSchema]: z.infer<
		(typeof ApplyToJobResponseSchema)[statusCode]
	>;
};

export type ApplyToJobRequest = FastifyRequest<{
	Params: ApplyToJobBodyParams;
	Body: ApplyToJobBody;
	Reply: ApplyToJobReplyType;
}>;

export type ApplyToJobReply = FastifyReply<{
	Reply: ApplyToJobReplyType;
}>;

export async function applyToJobController(
	request: ApplyToJobRequest,
	reply: ApplyToJobReply,
) {
	const { id } = request.params;
	const {
		applicantFirstName,
		applicantLastName,
		applicantEmail,
		applicantPhone,
		applicantResumeUrl,
	} = request.body;

	const applyToJobDTO: ApplyToJobDTO = {
		jobId: id,
		applicantFirstName,
		applicantLastName,
		applicantEmail,
		applicantPhone,
		applicantResumeUrl,
	};

	const applyToJobService = makeApplyToJobService();

	const jobApplication = await applyToJobService.execute(applyToJobDTO);

	return reply.status(201).send({
		jobApplication: {
			id: jobApplication.id,
			jobId: jobApplication.jobId,
		},
	});
}
