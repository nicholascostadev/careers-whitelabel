import { makeApplyToJobService } from "@/services/factories/make-apply-to-job-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const ApplyToJobBodyParamsSchema = z.object({
	id: z.string(),
});

const ApplyToJobBodySchema = z.object({
	applicantFirstName: z.string(),
	applicantLastName: z.string(),
	applicantEmail: z.string(),
	applicantPhone: z.string(),
	applicantResumeUrl: z.string(),
});

export async function applyToJobController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { id } = ApplyToJobBodyParamsSchema.parse(request.params);
	const {
		applicantFirstName,
		applicantLastName,
		applicantEmail,
		applicantPhone,
		applicantResumeUrl,
	} = ApplyToJobBodySchema.parse(request.body);

	const applyToJobService = makeApplyToJobService();

	const jobApplication = await applyToJobService.execute({
		jobId: id,
		applicantFirstName,
		applicantLastName,
		applicantEmail,
		applicantPhone,
		applicantResumeUrl,
	});

	return reply.status(201).send({
		jobApplication,
	});
}
