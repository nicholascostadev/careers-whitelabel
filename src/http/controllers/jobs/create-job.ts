import { makeCreateJobService } from "@/services/factories/make-create-job-service";
import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const CreateJobRequestSchema = z.object({
	title: z.string().min(1),
	descriptionMarkdown: z.string().min(1),
	departmentId: z.string().min(1),
	country: z.string().min(1),
	city: z.string().min(1),
	workplaceLocation: z.nativeEnum(WorkplaceLocation),
	employmentType: z.nativeEnum(EmploymentType),
	salaryMin: z.number().optional(),
	salaryMax: z.number().optional(),
	status: z.nativeEnum(JobStatus).optional(),
	tags: z.array(z.string()).optional(),
});

export async function createJobController(
	request: FastifyRequest,
	reply: FastifyReply,
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
	} = CreateJobRequestSchema.parse(request.body);

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
