import { makeCreateDepartmentService } from "@/services/factories/make-create-department-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const CreateDepartmentBodySchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
});
type CreateDepartmentBody = z.infer<typeof CreateDepartmentBodySchema>;

export const CreateDepartmentResponseSchema = {
	201: z.object({
		department: z.object({
			id: z.string(),
			name: z.string(),
		}),
	}),
	401: z.object({
		message: z.string(),
	}),
};

type CreateDepartmentReplyType = {
	[statusCode in keyof typeof CreateDepartmentResponseSchema]: z.infer<
		(typeof CreateDepartmentResponseSchema)[statusCode]
	>;
};

export type CreateDepartmentRequest = FastifyRequest<{
	Body: CreateDepartmentBody;
	Reply: CreateDepartmentReplyType;
}>;

export type CreateDepartmentReply = FastifyReply<{
	Reply: CreateDepartmentReplyType;
}>;

export async function createDepartmentsController(
	request: CreateDepartmentRequest,
	reply: CreateDepartmentReply,
) {
	const createDepartmentService = makeCreateDepartmentService();

	const department = await createDepartmentService.execute(request.body);

	return reply.status(201).send({
		department,
	});
}
