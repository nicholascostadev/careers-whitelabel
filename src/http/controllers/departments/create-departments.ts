import { makeCreateDepartmentService } from "@/services/factories/make-create-department-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const CreateDepartmentBodySchema = z.object({
	name: z.string(),
});

export async function createDepartmentsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { name } = CreateDepartmentBodySchema.parse(request.body);

	const createDepartmentService = makeCreateDepartmentService();

	const department = await createDepartmentService.execute({
		name,
	});

	return reply.status(201).send({
		department,
	});
}
